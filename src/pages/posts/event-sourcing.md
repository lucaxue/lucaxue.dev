---
title: Event Sourcing 101
date: 2022-02-17T13:00:00.000+00:00
duration: 3min
---

One of the interesting things I've not so recently learned about, is event sourcing. In simple terms, it is a way of creating software models with events. What does that even mean and why is it useful?

## Working with bank accounts

Imagine if you were trying to build an application for a bank, and you were working on the bank account.

For the purposes of this blog, let's just oversimplify, and assume that a bank account only holds the ID of the account holder, and its amount as a float.

You can imagine a snippet like the following for updating the balance of an account. You retrieve the account from the database, update its balance, then persist the updated account in the database, simple enough.

```php
$account = $repository->find($id);
$account->deposit(1000);
$repository->save($account);
```

```php
class BankAccount
{
    public function deposit(float $amount) : void
    {
        $this->amount += $amount;
    }
}
```

This is all well and good, now imagine if you had a requirement, where the transaction history is required. For example, using it to check if a user is allowed to make a deposit, or simply needing to display the history in the UI. How would you handle this?

## Modelling with events

If you think about, as far as we're concerned, a bank account is just a series of user transations. Instead of using a row in a table to model our account, could we somehow use a series of events to make up our model?


Rebuild model from events
Interact with the model
Store changes in the model



```php
class BankAccount
{
    use EventSourcedEntity;

    public static function open(
        UserId $accountHolder,
        Amount $amount,
    ) : self {
        // ...
    }
}
```
