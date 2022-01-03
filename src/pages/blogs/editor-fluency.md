---
title: Editor Fluency
---

# Editor Fluency

One of the universal skills that all developers should have, is being fluent with at least one text editor.

As it says in The Pragmatic Programmer,

> You need to be able to manipulate text as effortlessly as possible,
> because text is the basic raw material of programming.
>
> &mdash; <cite>The Pragmatic Programmer, Topic 18</cite>

Why does this even matter? Well, over the course of your career, it will actually save you a significant amount of time. More importantly, however, it will allow you to get your thoughts down onto the editor as fast as possible. Afterall, programming is all about thinking and getting your thoughts down.

In this blog, I'll go through some tips on how to achieve this, and some practical things I do to do so. I am by no mean an expert, and this won't make you one either. However, my aim is to start your process towards editor fluency.

## There is always a better way

The mindset to have, is to always question if there is a better way to do things. Whenever you happen to repeat a manual, multistep, or tedious task, question yourself if you could achieve the same with less steps.

For example, do you find yourself opening files by clicking through the file explorer? Do you find yourself clicking through your tabs to change between files? Manually clicking to get to specific parts of the code?

For most cases, the solution is finding the right keyboard shortcut.

## Editing with VSCode

My editor of choice is [VSCode](https://code.visualstudio.com). It is highly customizable, and with its extensions, I can achieve a perfect middle ground between a raw text editor and an IDE.

To get the most of it, however, I recommend looking through the [keyboard shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings) (`Cmd + K + Cmd + S`), and utilising them as much as possible.

Some of the most common shortcuts I use are:

- `Cmd + P` - Open File
- `Cmd + \` - Split Screen
- `Cmd + Num` - Focus Between Split Tabs
- `Cmd + B` - Toggle Side Bar
- `Cmd + J` - Toggle Terminal
- `Cmd + Shift + H` - Global Find and Replace
- `Cmd + K + Cmd + I` - Show Hover
- `Ctrl + Space` - Show Suggestions

I have also fair amount of custom keyboard shorcuts, but I won't go through them here.

A good start is that whenever you find yourself doing something manual or repetitive, find an appropriate command for it on the command palette (`Cmd + Shift + P`), click the gear icon, and add a keyboard shortcut for it.
Don't be afraid to use Google as well.

You might be thinking, how about using an IDE? Although IDEs provide a lot of functionality for a specific language and its ecosystem, I still personally prefer the flexibility of using a text editor. I have no strong opinions on this though, if you prefer to use an IDE, by all means, go for it.

## Manipulating text with Vim

As described on the [Vim homepage](https://www.vim.org) "Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient." You can certainly use Vim as your main editor, but I personally prefer to use the [Vim extension](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) on for VSCode.

Vim introduces a different paradigm for text editing, and highly encourages using only the keyboard for manupulating text.

It does have a steep learning curve, but trust me, it is definitely worth the effort. The value you get out of learning it far outweighs the time you invest. I am, at best, intermediate with Vim, and yet I already feel a lot more productive using it.

Just let this example do the talking:

![Vim HTML to CSV demo](/public/vim-html-to-csv-demo.gif)

<figcaption>

_Using Vim to convert a HTML table to a CSV file._

</figcaption>

This isn't a guide for Vim, so here are a few resources I recommend:

- [Official Vim Docs](https://www.vim.org/docs.php)
- [The Missing Semester of Your CS Education - Editors (Vim)](https://missing.csail.mit.edu/2020/editors)
- [Ben Awad - Vim Tutorial](https://www.youtube.com/watch?v=IiwGbcd8S7I)
- Using [vimtutor](http://www2.geog.ucl.ac.uk/~plewis/teaching/unix/vimtutor) on your command line

## Closing off

Of course, there many more things you can do. Having aliases for commonly used terminal commands is just one example, but I didn't feel it was appropriate for this blog. Netherveless, I hope this blog has helped you in one way or another. With daily practice, and the right mindset, you'll reach closer towards editor fluency. Happy hacking!
