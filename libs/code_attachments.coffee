class CodeBlockAttachments
  attaching = registerHash 'code_attachments_currently'
  codeCache = JsPersistence.tryGet "CodeBlockAttachments", {}

  generateAttachment = (block, type) ->
    block = switch type
      when "cf" then CoffeeScript.compile block, bare: yes
      when "js" then block
      else throw "Unknown code type '#{type}'"
    return new org.bukkit.metadata.FixedMetadataValue plugin, block

  registerPermission "js.code.attaching", "op"

  for key, code of codeCache
    split = key.split ','
    world = Bukkit.server.getWorld split[3]
    block = world.getBlockAt split[0], split[1], split[2]
    attachment = new org.bukkit.metadata.FixedMetadataValue plugin, code
    block.setMetadata "CodeBlockAttachment", attachment

  registerCommand
    name: "blockcode",
    description: "Attaches code to a block, use {clipboard} with spout to use your clipboard.",
    usage: "\xA7e/<command> <js/cf> [code...]",
    permission: "js.code.attaching",
    permissionMessage: "\xA7cI say good sir, you appear to be in a spot of bother, but you can not be allowed to continue with this action.",
    aliases: [ "bc" ],
    (sender, label, args, flags) ->
      throw "Only a player can do that!" unless sender instanceof org.bukkit.entity.Player
      if args.length is 0 and attaching[sender.entityId]?
        attaching[sender.entityId] = undefined
        sender.sendMessage "\xA7cAttachment cancelled."
        return
      type = args.splice(0, 1)[0]
      message = args.join ' '
      message = message.replace /\{clipboard\}/i, sender.clipboardText

      attachment = generateAttachment message, type

      sender.sendMessage "\xA7a#{attachment.asString()}"
      sender.sendMessage "\xA76The previous code will be attached to the next block you click. Cancel with /#{label}"

      attaching[sender.entityId] = attachment

  getMetadata = (block, key, plugin) ->
    return null unless block.hasMetadata key
    keys = _a block.getMetadata key
    if plugin?
      for key in keys
        return key if key.owningPlugin is plugin
      return null
    else
      return keys[0]

  registerEvent player, 'interact', (event) ->
    return unless event.action is event.action.RIGHT_CLICK_BLOCK
    block = event.clickedBlock
    if attaching[event.player.entityId]?
      if getMetadata(block, "CodeBlockAttachment", plugin)?
        block.removeMetadata "CodeBlockAttachment", plugin
      attachment = attaching[event.player.entityId]
      block.setMetadata "CodeBlockAttachment", attachment
      cacheKey = "#{block.x},#{block.y},#{block.z},#{block.world.name}"
      codeCache[cacheKey] = _s attachment.asString()
      JsPersistence.save()
      event.player.sendMessage "\xA76Code attached to #{block.type} @ data=#{block.data}, x=#{block.x}, y=#{block.y}, z=#{block.z}"
      attaching[event.player.entityId] = undefined
      event.cancelled = yes
      return

    attachment = getMetadata block, "CodeBlockAttachment", plugin
    return unless attachment?

    ext =
      p: event.player
      loc: event.player.location
      i: event.player.itemInHand
      world: event.player.world
      pl: _a Bukkit.server.onlinePlayers
      en: org.bukkit.entity

    try
      if (evalInContext attachment.asString(), ext) == no
        event.cancelled = yes
    catch error
      event.cancelled = yes
      if typeof error is 'string'
        event.player.sendMessage "\xA7c#{error}"
      else
        log "#{error}", 'c'

  AttachCode: (block, code) ->
    attachment = new org.bukkit.metadata.FixedMetadataValue plugin, codeblock.setMetadata "CodeBlockAttachment", attachment
    cacheKey = "#{block.x},#{block.y},#{block.z},#{block.world.name}"
    codeCache[cacheKey] = _s attachment.asString()
    JsPersistence.save()
    true
