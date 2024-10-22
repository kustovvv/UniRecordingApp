import subprocess


def get_device_udid():
    result = subprocess.run(['adb', 'devices'], capture_output=True, text=True)
    lines = result.stdout.split('\n')
    device = lines[1]
    if device:
        udid = device.split("\t")
        return udid[0]

    return None


def android_get_desired_capabilities():
    return {
        'autoGrantPermissions': True,
        'automationName': 'uiautomator2',
        'newCommandTimeout': 500,
        'noSign': True,
        'platformName': 'Android',
        'platformVersion': '14',
        'resetKeyboard': True,
        'systemPort': 8301,
        'takesScreenshot': True,
        'deviceName': 'Pixel 8 Pro API 34',
        'udid': get_device_udid(),
        'appPackage': 'com.recordingapp',
        'appActivity': 'com.recordingapp.MainActivity'
    }