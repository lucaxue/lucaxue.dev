---
title: Event Sourcing
date: 2022-03-12T18:00:00.000+00:00
duration: 8min
---

One of the interesting things I've not so recently learned about, is event sourcing. In simple terms, it is a way of creating software models with events. What does that even mean and why is it useful?

## Working with bank accounts

Imagine if you were trying to build an application for a bank, and you were working on the bank account.

For the purposes of this blog, let's just oversimplify, and assume that a bank account only holds an ID, and its amount as a float.

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

Events are simple data structures, like DTOs, that rapresent something that happend in the past. They hold the necessary data that matters to an event. Domain events, are slightly more specific, and represent something important to the problem domain we're solving. In our case, we care about an amount being deposit, so we appropriately name the event as `AmountWasDeposited`, and let it hold the bank account's ID as well as the amount deposited. Events are what we'll be persisting, so we'll want some serialization and hydration logic in them too.

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
You may have noticed that we now extend the `EventSourcedAggregate` class, which contains all the logic to handle event sourcing. When recording an event, we first append it in memory, then we find the appropriate event handler to apply the event to our model.

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

Now that we have seen how logic is handled in the model, let's take a look at how our model is persisted through their events. First, our aggregate needs a simple mechanism to release all of the event from its memory:

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

Next, in our repository, we use messages to wrap the released events with whatever additional metadata we might need - such as a timestamp and the ID of the bank account (this is crucial, as it is used to identify the correct events for each bank account). The messages are then persisted in an event store, a data store used only for storing events, and published to the rest of our application.

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

Our model also needs to be able to be hydrated from its events. We can handle that by applying all the events to build up our model.

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

This allows us to fetch the events from its event store, and use those to reconstitute our model.

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

### Handling different UI needs with projections

How will we query the for the bank account transactions that the UI might need? We could simply query the events, which is probably fine for this example, but for more complex UI needs, a dedicated read model, or a projection, is usually needed. Since we publish the events when saving our model, we can register an event subscriber to persist a bank account transation record to a data store of our choice. In this example, the projection is simply persisted into a database table.

```php
class BankAccountTransactionSubscriber implements Subscriber
{
    // ...

    public function isSubscribedTo(Message $message) : bool
    {
        return $message->event() instanceof AmountWasDeposited;
    }

    public function handle(Message $message) : void
    {
        $this->connection
            ->table('bank_account_transactions')
            ->insert([
                'id' => $message->event()->id(),
                'amount' => $message->event()->amount(),
                'occurred_on' => $message->occurredOn(),
            ]);
    }
}
```

## Closing words and related ideas

I found the concept of event sourcing hard to digest when I first encountered it. Hopefully this pragmatic introduction to the topic is helpful to you. Some ideas are usually paired with event sourcing include CQRS, DDD and Hexagonal architecture to mention a few. I highly recommend looking into those if you're curious enough. Maybe I'll write something about those in future blogs. Happy hacking, and have a wonderful day.
