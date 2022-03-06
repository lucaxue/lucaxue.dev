---
title: Event Sourcing
date: 2022-02-17T13:00:00.000+00:00
duration: 10min
---

One of the interesting things I've not so recently learned about, is event sourcing. In simple terms, it is a way of creating software models with events. What does that even mean and why is it useful?

## Working with bank accounts

Imagine if you were trying to build an application for a bank, and you were working on the bank account.

For the purposes of this blog, let's just oversimplify, and assume that a bank account only holds the ID of the account holder, and its amount as a float.

You can imagine a snippet like the following for depositing some amount to an account. You retrieve the account from the database, update its balance, then persist the updated account in the database, simple enough.

```php
// Retrieve the model from the database...
$account = $repository->find($id);

// Update the model...
$account->deposit(1000);

// Save the changes into the database.
$repository->save($account);
```

The implementation for bank account model might look something like this:

```php
class BankAccount
{
    // ...

    public function deposit(float $amount) : void
    {
        $this->amount += $amount;
    }
}
```

This is all well and good. Now imagine if you had a requirement, where the transaction history is required. For example, using it to check if a user is allowed to make a deposit, or simply needing to display it in the UI. How would you handle this?

## Modelling with events

If you think about, as far as we're concerned, a bank account is just a series of user transations. Instead of using a row in a table to model our account, could we somehow use a series of events to make up our model?

```php
// Build the model from its events...
$account = $repository->find($id);

// Record and apply an event...
$account->deposit(1000);

// Persist and publish the event.
$repository->save($account);
```

Fortunately the code above, remains exactly the same with only changes happening in its implementation. Let's take a look at what the bank account model looks like now:

```php
class BankAccount extends EventSourcedAggregate
{
    // ...

    public function deposit(float $amount) : void
    {
        $this->recordThat(new AmountWasDeposited($this->id(), $amount));
    }

    protected function applyAmountWasDeposited(AmountWasDeposited $event) : void
    {
        $this->amount += $event->amount;
    }
}
```

This may look at bit confusing at first, but we'll go through it. Notice how instead of directly performing the logic in the `deposit` method, we record an event. The logic is then applied in the event handling method, as you can see in `applyAmountWasDeposited`.
Before diving more in depth onto how that all works together, let's take a quick look at what events are.

### Events and Domain Events

Events are simple objects, like DTOs, that rapresent something that happend in the past. Domain events, are slightly more specific, and represent something important to the problem domain we're solving. In our case, we care about an amount being deposit, so we appropriately name the event as `AmountWasDeposited`. Events are what we'll be persisting, so we'll want some serialization and hydration logic in them too.

```php
class AmountWasDeposited implements DomainEvent
{
    public function __construct(
        public readonly BankAccountId $id,
        public readonly float $amount,
    ) {}

    // Some logic to serialise to JSON and hydrate from JSON...
}
```

### Recording our events

Moving back to our `BankAccount` model, let's take a look at how the events are recorded.
You may have noticed that we now extend the `EventSourcedAggregate` class, which contains all the logic to handle event sourcing. First we append it in memory, then we find the appropriate event handler to apply the event to our model.

```php
class BankAccount extends EventSourcedAggregate {/** */}
```

```php
abstract class EventSourcedAggregate
{
    private array $recordedEvents = [];

    // ...

    protected function recordThat(DomainEvent $event) : void
    {
        $this->recordedEvents[] = $event;
        $this->apply($event);
    }

    private function apply(DomainEvent $event) : void
    {
        $this->eventHandler($event)($event);
    }

    private function eventHandler(DomainEvent $event) : callable
    {
        $handler = 'apply'.(new ReflectionClass($event))->getShortName();

        if ( ! method_exists($this, $handler)) {
            throw new Exception($handler.' not found');
        }

        return [$this, $handler];
    }
}
```

### Model persistence and hydration

Now that we have seen how logic is handled in the model, let's take a look at how our model is persisted by their events. First, our bank account needs a simple mechanism to release all of the event from its memory:

```php
abstract class EventSourcedAggregate
{
    // ...

    public function releaseEvents() : array
    {
        $events = $this->recordedEvents;
        $this->recordedEvents = [];
        return $events;
    }
}
```

Next, in our repository, we use messages to wrap the released events with whatever additional metadata we might need, such as a timestamp and the ID of the bank account (this is crucial, as it is used as an the events for each bank account). The messages are then persisted in a data store, such as a database, and published to the rest of our application.

```php
class EventSourcedBankAccountRepository implements BankAccountRepository
{
    // ...

    public function save(BankAccount $account) : void
    {
        $id = $account->id();
        $events = $account->releaseEvents();

        foreach ($events as $event) {
            $message = new Message($id, $event, Carbon::now()),

            $this->store->persist($message);
            $this->publisher->publish($message);
        }
    }
}
```

Our model also needs to be able to be hydrated from its events. We can handle that by simply applying all the events in order to build up our model.

```php
abstract class EventSourcedAggregate
{
    // ...

    public static function reconstituteFromEvents(array $events) : static
    {
        $aggregate = new static;

        foreach ($events as $event) {
            $aggregate->apply($event);
        }

        return $aggregate;
    }
}
```

Our repository then fetches the events from its data store, and use those to reconstitute our model.

```php
class EventSourcedBankAccountRepository implements BankAccountRepository
{
    // ...

    public function find(BankAccountId $id) : BankAccount
    {
        $events = $this->store->fetchEvents($id);

        return BankAccount::reconstituteFromEvents($events);
    }
}
```

## Handling different UI needs with projections

```php
class BankAccountTransactionSubscriber implements Subscriber
{
    public function isSubscribedTo(Message $message) : bool
    {
        return $message->event() instanceof AmountWasDeposited;
    }

    public function handle(Message $message) : void
    {
        BankAccountTransaction::updateOrCreate([
            'id' => $message->event()->id(),
        ], [
            'amount' => $message->event()->amount(),
            'occurred_on' => $message->occurredOn(),
        ]);
    }
}
```
