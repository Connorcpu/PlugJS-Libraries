
ignoreList = JsPersistence.tryGet "ignoreList", {}

ignoreList = (sender, rlist) ->
  list = ignoreList[sender.name] ||= []
  for player in list
    continue unless gplr player
    rlist.remove gplr player
  for player,list in ignoreList
    continue unless gplr player
    rlist.remove gplr player unless list.indexOf _s(sender.name) == -1

formatChat = (format, fmtEvent) ->
  for param in chatFormatParams
    format = format.replace(":#{param}", fmtEvent[param] || "")
  format.replace(":message", "%2$s")

formatInformation = (event, params) ->
  fmtEvent =
    prefix: ''
    suffix: ''
    displayName: event.player.displayName
    player: event.player
  if params
    for key,param of params
      fmtEvent[key] = param
  callEvent js, "chatFormat", fmtEvent
  fmtEvent

global_mute = no

standardChat = (event) ->
  if global_mute and not event.player.hasPermission '*'
    event.cancelled = yes
    event.player.sendMessage "\xA7cGlobal Mute has been activated"
    return

  event.format = formatChat chatFormat, formatInformation event
  ignoreList event.player, event.recipients