---
title: Event Sourcing
date: 2022-02-17T13:00:00.000+00:00
duration: 5min
---

One of the interesting things I've not so recently learned about, is event sourcing. In simple terms, it is a way of creating software models with events. What does that even mean and why is it useful?

## Working with bank accounts

Imagine if you were trying to build an application for a bank, and you were working on the bank account.

For the purposes of this blog, let's just oversimplify, and assume that a bank account only holds the ID of the account holder, and its amount as a float.

You can imagine a snippet like the following for updating the balance of an account. You retrieve the account from the database, update its balance, then persist the updated account in the database, simple enough.

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

// Perform an update that fires an event...
$account->deposit(1000);

// Append the new event to the event stream.
$repository->save($account);
```

* Rebuild model from events
* Interact with the model
* Store changes in the model

Fortunately the code above, remains exactly the same with only changes happening in its implementation.
Let's take a look at what the bank account model looks like now:

```php
class BankAccount
{
    // ...

    public function deposit(float $amount) : void
    {
        $this->recordThat(new AmountWasDeposited($this->id(), $amount));
    }

    private function applyAmountWasDeposited(AmountWasDeposited $event) : void
    {
        $this->amount += $event->amount;
    }
}
```

This may look at bit confusing at first, but we'll go through it. Notice how instead of directly performing the logic in the `deposit` method, we record an event, and the logic for performing the event is moved onto another method, that receives the event recorded. Before diving more in depth, onto how that all works together, let's take a look at what events are.

### Events and Domain Events

Events are simple DTO's that rapresent something that happend in the past. Domain events, is a slightly more specific, and represent something important to the problem domain we're solving that happened in the past. In our case, we care about an amount being deposit, so we appropriately name the event as `AmountWasDeposited`. Events are what we'll be persisting, for the models to be built up, so we'll want some serialization and hydration logic in them too.

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

### Event Sourced Aggregate 

Let's move back to the 

```php
class BankAccount extends EventSourcedAggregate
{
    // ...
}
```

```php
abstract class EventSourcedAggregate
{
    protected function recordThat(DomainEvent $event) : void
    {
        $this->handler($event)($event);
    }

    private function handler(DomainEvent $event) : string
    {
        $handler = 'apply'.(new ReflectionClass($event))->getShortName();
        if ( ! method_exists($this, $handler)) {
            throw new Exception($handler.' not found.');
        }
        return $handler;
    }

    // ...
}
```







