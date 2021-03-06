class TimeSpan
  constructor: (@value, @datatype) ->
    unless @value
      @value = 0
      @datatype = 'milliseconds'
    else if @value.value
      @datatype = @value.datatype
      @value = @value.value
    else @datatype ||= 'milliseconds'

  class TimeSpanOfConverter
    constructor: (@span) ->
    @prop 'time', get: () -> @milliseconds
    @prop 'milliseconds', get: () -> @span.to_milliseconds.value
    @prop 'ticks', get: () -> @span.to_ticks.value
    @prop 'seconds', get: () -> @span.to_seconds.value
    @prop 'minutes', get: () -> @span.to_minutes.value
    @prop 'hours', get: () -> @span.to_hours.value
    @prop 'days', get: () -> @span.to_days.value
    @prop 'weeks', get: () -> @span.to_weeks.value

  @prop 'to_milliseconds',
    get: () ->
      value = switch @datatype
        when 'weeks' then @value * 7 * 24 * 60 * 60 * 1000
        when 'days' then @value * 24 * 60 * 60 * 1000
        when 'hours' then @value * 60 * 60 * 1000
        when 'minutes' then @value * 60 * 1000
        when 'seconds' then @value * 1000
        when 'ticks' then @value * 50
        when 'milliseconds' then @value
      new TimeSpan value, 'milliseconds'
  @prop 'to_ticks', get: () -> new TimeSpan @to_milliseconds.value / 50, 'ticks'
  @prop 'to_seconds', get: () -> new TimeSpan @to_milliseconds.value / 1000, 'seconds'
  @prop 'to_minutes', get: () -> new TimeSpan @to_seconds.value / 60, 'minutes'
  @prop 'to_hours', get: () -> new TimeSpan @to_minutes.value / 60, 'hours'
  @prop 'to_days', get: () -> new TimeSpan @to_hours.value / 24, 'days'
  @prop 'to_weeks', get: () -> new TimeSpan @to_days.value / 7, 'weeks'
  @prop 'ago', get: () -> new java.util.Date().time - @to_milliseconds.value
  @prop 'from_now', get: () -> new java.util.Date().time + @to_milliseconds.value
  @prop 'of', get: () -> new TimeSpanOfConverter @
  @prop 'now', get: () -> 0.ticks.from_now
  
  TimeSpan::toString = () ->
    type = @datatype
    type = type.replace /s$/, '' if @value.to_n == 1
    "#{Math.round @value} #{type}"
  TimeSpan::toJSON = () -> value: @value, datatype: @datatype

Number.prop 'milliseconds', get: () -> new TimeSpan @, 'milliseconds'
Number.prop 'ticks', get: () -> new TimeSpan @, 'ticks'
Number.prop 'seconds', get: () -> new TimeSpan @, 'seconds'
Number.prop 'minutes', get: () -> new TimeSpan @, 'minutes'
Number.prop 'hours', get: () -> new TimeSpan @, 'hours'
Number.prop 'days', get: () -> new TimeSpan @, 'days'
Number.prop 'weeks', get: () -> new TimeSpan @, 'weeks'

Number.prop 'millisecond', get: () -> @milliseconds
Number.prop 'tick', get: () -> @ticks
Number.prop 'second', get: () -> @seconds
Number.prop 'minute', get: () -> @minutes
Number.prop 'hour', get: () -> @hours
Number.prop 'day', get: () -> @days
Number.prop 'week', get: () -> @weeks

Object.prop 'to_n', get: () -> new Number(@) + 0