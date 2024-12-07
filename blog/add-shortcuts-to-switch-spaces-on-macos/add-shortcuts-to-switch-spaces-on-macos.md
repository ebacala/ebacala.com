---
id: add-shortcuts-to-switch-spaces-on-macos
title: How to add shortcuts to switch between macOS spaces?
description: How to add shortcuts to switch between macOS spaces?
author: Evann
publishedDate: 2024-10-13
---

## Introduction

One day, when I had some time to spare, I decided to install Arch Linux on a computer I had laying around. I wanted to experiment with i3 and customize it to my needs.
After a lot of documentation reading and a lot (like a LOT) of trial and error, I was satisfied with my desktop environment. One thing I really enjoyed back then was the ability the instantly switch between workspaces (I used the `Mod + [1-9]` keybinds to switch between them).

When I got back to macOS, I really missed this feature. Though I could manually create a space (or virtual desktop, workspace, whatever you want to call it) and move between them using the trackpad gestures (a 3-finger swipe to the left or right), it was not as efficient as being able to use a keybind to switch between them.

So I looked for a way to add this feature to my Mac. After a bit of research, I found out that I could use [Hammerspoon](https://www.hammerspoon.org/) to create custom keybinds. This is how Hammerspoon is described on their website:

> This is a tool for powerful automation of macOS. At its core, Hammerspoon is just a bridge between the operating system and a Lua scripting engine. What gives Hammerspoon its power is a set of extensions that expose specific pieces of system functionality, to the user.

You can either download the app on their [github release page](https://github.com/Hammerspoon/hammerspoon/releases) or install it with Homebrew (`brew install --cask hammerspoon`).

What I want is quite straightforward: I want to be able to press `Cmd + [1-9]` to switch between my different spaces. I planned this feature in steps:

- For fast iteration and testing, I want some hot reloading of my Lua script.
- I want to constantly have nine spaces available so I don't have to create them manually
- I want to define my keybinds `Cmd + [1-9]` to switch between the spaces

Here we go!

## Hot reloading

For this first step, it's easy as Hammerspoon itself comes with a [way to add hot reloading](https://www.hammerspoon.org/go/#fancyreload) to the script:

```lua copy=true
function reloadConfig(files)
    doReload = false
    for _,file in pairs(files) do
        if file:sub(-4) == ".lua" then
            doReload = true
        end
    end
    if doReload then
        hs.reload()
    end
end

configWatcher = hs.pathwatcher.new(os.getenv("HOME") .. "/.hammerspoon/", reloadConfig):start()
hs.alert.show("Config loaded")
```

Basically, this code watches for any changes in the `~/.hammerspoon` directory and reloads the configuration if a Lua file has been modified.

## Constantly have nine spaces available

First I used the `hs.spaces.missionControlSpaceNames()` method which returns a table containing the names of the spaces for each screen. The output looks like this:

```text
{
  ["28F06C95-AC13-4A95-09BF-CC1A0FAEEAC4"] = {
    [7] = "Desktop 3",
    [170] = "Desktop 1",
    [243] = "Desktop 2",
    [255] = "Desktop 4",
    [303] = "Desktop 5",
    [315] = "Desktop 6",
    [346] = "Desktop 7",
    [347] = "Desktop 8",
    [389] = "Desktop 9"
  }
}
```

It's a table using the screens identifier as keys. Each key links to another table containing the space IDs as keys and the space names as values. Unfortunately the spaces are not ordered. So I had to order them myself. This is what I came up with (it might not be super optimized but I did it quickly thanks to Google and Claude 🤷‍♂️):

```lua copy=true
function getSortedSpacesIdArray()
  local spacesNames = hs.spaces.missionControlSpaceNames()
  local desktopIdArray = {}

  for _, spaceInfo in pairs(spacesNames) do
    for id, name in pairs(spaceInfo) do
      if name:match("^Desktop %d+$") then
        table.insert(desktopIdArray, {id = id, number = tonumber(name:match("%d+"))})
      end
    end
  end

  table.sort(desktopIdArray, function(a, b)
    return a.number < b.number
  end)

  local sortedIdArray = {}
  for _, item in ipairs(desktopIdArray) do
    table.insert(sortedIdArray, item.id)
  end

  return sortedIdArray
end
```

Now that I have a sorted array of space IDs, I will be able to use it to switch between spaces later on. What I want now is to constantly have nine spaces available so I don't have to create them manually. This is what I came up with:

```lua copy=true
function updateSpacesArray()
  spacesArray = getSortedSpacesIdArray()
end

function addSpacesUntilWeHaveNine()
  while #spacesArray < 9 do
    hs.spaces.addSpaceToScreen()
    updateSpacesArray()
  end
end

spacesArray = {}
updateSpacesArray()
addSpacesUntilWeHaveNine()
```

Basically, it's a simple loop that creates a new space until there are nine of them. If Hammerspoon is launched at login, it will automatically add the missing spaces.

## Define the keybinds

The last thing to do is to define the keybinds. I want to be able to switch between the spaces using `Cmd + [1-9]` so I wrote the following code:

```lua copy=true
hs.hotkey.bind({"cmd"}, "&", function()
  hs.spaces.gotoSpace(spacesArray[1])
end)

hs.hotkey.bind({"cmd"}, "é", function()
  hs.spaces.gotoSpace(spacesArray[2])
end)

hs.hotkey.bind({"cmd"}, "\"", function()
  hs.spaces.gotoSpace(spacesArray[3])
end)

hs.hotkey.bind({"cmd"}, "'", function()
  hs.spaces.gotoSpace(spacesArray[4] )
end)

hs.hotkey.bind({"cmd"}, "(", function()
  hs.spaces.gotoSpace(spacesArray[5])
end)

hs.hotkey.bind({"cmd"}, "§", function()
  hs.spaces.gotoSpace(spacesArray[6])
end)

hs.hotkey.bind({"cmd"}, "è", function()
  hs.spaces.gotoSpace(spacesArray[7])
end)

hs.hotkey.bind({"cmd"}, "!", function()
  hs.spaces.gotoSpace(spacesArray[8])
end)

hs.hotkey.bind({"cmd"}, "ç", function()
  hs.spaces.gotoSpace(spacesArray[9])
end)
```

A simple but effective way to bind each key to the corresponding index in the `spacesArray`.

⚠ Please note that I use an AZERTY keyboard, so the bindings will need to be changed on other layouts.

## Conclusion

This was a simple way to add the feature I wanted to my Mac. I now have a fast way to switch between my different workspaces. The only drawbacks is that during the switch there is some animation playing. This is due to the fact that macOS does not allow you to switch between spaces without any animation. The only way to remove them is to turn on the "Reduce motion" option in the "Accessibility" settings, but this will have an impact on all animations in the system.

I hope you enjoyed this article, here's the whole script if you want to copy it:

```lua copy=true
function reloadConfig(files)
    doReload = false
    for _,file in pairs(files) do
        if file:sub(-4) == ".lua" then
            doReload = true
        end
    end
    if doReload then
        hs.reload()
    end
end

configWatcher = hs.pathwatcher.new(os.getenv("HOME") .. "/.hammerspoon/", reloadConfig):start()
hs.alert.show("Config loaded")

function getSortedSpacesIdArray()
  local spacesNames = hs.spaces.missionControlSpaceNames()
  local desktopIdArray = {}

  for _, spaceInfo in pairs(spacesNames) do
    for id, name in pairs(spaceInfo) do
      if name:match("^Desktop %d+$") then
        table.insert(desktopIdArray, {id = id, number = tonumber(name:match("%d+"))})
      end
    end
  end

  table.sort(desktopIdArray, function(a, b)
    return a.number < b.number
  end)

  local sortedIdArray = {}
  for _, item in ipairs(desktopIdArray) do
    table.insert(sortedIdArray, item.id)
  end

  return sortedIdArray
end

function updateSpacesArray()
  spacesArray = getSortedSpacesIdArray()
end

function addSpacesUntilWeHaveNine()
  while #spacesArray < 9 do
    hs.spaces.addSpaceToScreen()
    updateSpacesArray()
  end
end

spacesArray = {}
updateSpacesArray()
addSpacesUntilWeHaveNine()

hs.hotkey.bind({"cmd"}, "&", function()
  hs.spaces.gotoSpace(spacesArray[1])
end)

hs.hotkey.bind({"cmd"}, "é", function()
  hs.spaces.gotoSpace(spacesArray[2])
end)

hs.hotkey.bind({"cmd"}, "\"", function()
  hs.spaces.gotoSpace(spacesArray[3])
end)

hs.hotkey.bind({"cmd"}, "'", function()
  hs.spaces.gotoSpace(spacesArray[4] )
end)

hs.hotkey.bind({"cmd"}, "(", function()
  hs.spaces.gotoSpace(spacesArray[5])
end)

hs.hotkey.bind({"cmd"}, "§", function()
  hs.spaces.gotoSpace(spacesArray[6])
end)

hs.hotkey.bind({"cmd"}, "è", function()
  hs.spaces.gotoSpace(spacesArray[7])
end)

hs.hotkey.bind({"cmd"}, "!", function()
  hs.spaces.gotoSpace(spacesArray[8])
end)

hs.hotkey.bind({"cmd"}, "ç", function()
  hs.spaces.gotoSpace(spacesArray[9])
end)
```