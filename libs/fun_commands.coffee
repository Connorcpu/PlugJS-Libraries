registerCommand {
    name: "me"
    description: "Broadcasts into chat as if you were doing the action"
    usage: "\xA7eUsage: /<command> <action>"
    permission: registerPermission("js.fun.me", "true")
    permissionMessage: "\xA7cYou don't have permission!"
  }, 
  (sender, label, args) ->
    message = args.join(" ")
    displayName = undefined
    if sender instanceof org.bukkit.command.ConsoleCommandSender
      displayName = "\xA7c*Console"
    else if sender instanceof org.bukkit.command.RemoteConsoleCommandSender
      displayName = "\xA7c*Rcon"
    else if sender instanceof org.bukkit.command.BlockCommandSender
      displayName = "[@]"
    else
      displayName = sender.displayName
    loader.server.broadcastMessage "\xA75* " + displayName + " \xA7r\xA75" + message

registerPermission "js.fun.ride.block", "op"
registerPermission "js.fun.ride.block.bypass", "op"
registerCommand {
    name: "ride"
    description: "Places you on top of another player"
    usage: "\xA7eUsage: /<command> <player>"
    permission: registerPermission("js.fun.ride", "true")
    permissionMessage: "\xA7cYou don't have permission!"
  },
  (sender, label, args) ->
    unless sender instanceof org.bukkit.entity.Player
      sender.sendMessage "\xA7cConsole can't do that xD"
      return
    return false unless args.length is 1
    target = gplr(args[0])
    if target.hasPermission("js.fun.ride.block") and not sender.hasPermission("js.fun.ride.block.bypass")
      sender.sendMessage "\xA7cYou don't have permission to ride them!"
      return
    if target.name is sender.name
      sender.sendMessage "\xA7cYou can't ride yourself o.O"
      return
    target.passenger = sender

registerCommand {
    name: "eject"
    description: "Gets anything off of you, and gets you out of anything"
    usage: "\xA7eUsage: /eject"
  }, 
  (sender, label, args) ->
    sender.leaveVehicle() if sender.vehicle
    sender.eject() if sender.passenger

registerCommand {
    name: "give"
    description: "Gives items!"
    usage: "\xA7eUsage: /<command> <player> <item[:data]> [amount]"
    permission: registerPermission "js.fun.give.others", "op"
    permissionMessage: "\xA7cNo can do, boss."
  },
  (sender, label, args) ->
    unless args.length >= 2 and args.length <= 3
      return false

    player = gplr(args[0])
    amount = 1
    data = 0

    itemId = if args[1].split(':').length == 2
      split = args[1].split(':')
      data = split[1]
      getItemId(split[0])
    else getItemId(args[1])
    if itemId == -1
      sender.sendMessage "\xA7cCan't find item '#{args[1]}'"
      return

    amount = args[2] if args[2]

    item = itemStack(itemId, amount, data)

    player.inventory.addItem [ item ]
    player.sendMessage "\xA7eYou were given #{amount}x#{item.type} by #{sender.name}"
    sender.sendMessage "\xA7eGiving #{amount}x#{item.type} to #{player.name}"

registerCommand {
    name: "item"
    description: "Give yourself an item!"
    usage: "\xA7eUsage: /<command> <item[:data]> [amount]"
    permission: registerPermission("js.fun.give", "op", [
      permission: "js.fun.give.others"
      value: true
    ])
    permissionMessage: "\xA7cNo can do, boss."
    aliases: [ "i" ]
  },
  (sender, label, args) ->
    unless sender instanceof org.bukkit.entity.Player
      sender.sendMessage "\xA7cOnly a player can do that!"
      return

    unless args.length >= 1 and args.length <= 2
      return false

    amount = 1
    data = 0

    itemId = if args[0].split(':').length == 2
      split = args[0].split(':')
      data = split[1]
      getItemId(split[0])
    else getItemId(args[0])

    if itemId == -1
      sender.sendMessage "\xA7cCan't find item '#{args[0].split(':')[0]}'"
      return

    amount = args[1] if args[1]

    item = itemStack(itemId, amount, data)
    sender.inventory.addItem [ item ]
    sender.sendMessage "\xA7eGiven #{amount} x #{item.type}"

registerPermission "js.fun.teleport.others", "op"
registerCommand {
    name: "tp"
    description: "Teleport to someone!"
    usage: "\xA7eUsage: /<command> [-f] [players] <target>"
    permission: registerPermission("js.fun.teleport", "op", [
      permission: "js.fun.teleport.others"
      value: on
    ])
    permissionMessage: "\xA7cNo can do, boss."
    aliases: [ "teleport" ]
    flags: on
  },
  (sender, label, args, flags) ->
    return false unless sender instanceof org.bukkit.entity.Player or args.length > 1
    teleport = if flags.indexOf('f') != -1
      (entity, location) -> 
        entity.sendMessage "\xA7eTeleported!"
        entity.teleport(location)
    else
      (entity, location) ->
        safeTeleport entity, location
        entity.sendMessage "\xA7eTeleported!"

    players = if args.length == 2 and args[0] == '*'
      _a loader.server.onlinePlayers
    else if args.length > 1
      _p = []
      for i in [0..args.length - 2]
        player = gplr(args[i])
        _p.push(player) if player
      _p
    else [ sender ]

    unless players.length
      sender.sendMessage "\xA7cNone of the players listed were found"
      return

    isCoords = (arg) ->
      split = arg.split(',')
      return false unless split.length == 3 or split.length == 4
      for k in [0..2]
        return false unless not isNaN split[k]
      return true if not split[3] or loader.server.getWorld(split[3])
      return false
    parseCoords = (arg) ->
      split = arg.split(',')
      cloneLocation getloc
        x: split[0]
        y: split[1]
        z: split[2]
        world: loader.server.getWorld(split[3]) || sender.world || players[0].world

    target = args[args.length - 1]
    target = if isCoords target
      parseCoords target
    else gplr(target).location

    unless target
      sender.sendMessage "\xA7cTarget not found!"
      return

    teleport player, target for player in players

    sender.sendMessage "\xA7ePlayer(s) teleported" unless players.indexOf(sender) != -1

registerCommand {
    name: "ping"
    description: "A way to tell if the server is responding"
    usage: "\xA7e/<command>"
    aliases: [ "pong" ]
  },
  (sender, label, args) ->
    if label == "ping"
      sender.sendMessage "\xA7ePong!"
    else
      sender.sendMessage "\xA7eI hear #{sender.displayName}\xA7e likes cute asian boys"
