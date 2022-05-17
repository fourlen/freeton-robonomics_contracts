from yeelight import SmartBulb

#change IP of your bulb here
bulb = SmartBulb('192.168.31.238')

def turn_on_off_bulb_irl():
    if bulb.is_on:
        bulb.power_off()
        print('Bulb powered off')
    else:
        bulb.power_on()
        print('Bulb powered on')