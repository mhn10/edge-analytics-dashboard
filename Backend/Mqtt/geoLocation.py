import geocoder
import requests

# ip = "134.201.250.155"
# api_key = "46d290c9988f2dafa3394cd7d978f5e9"

def getNodeLocation(ip, api_key) :
	freegeoip = "http://api.ipstack.com/{0}?access_key={1}".format(ip, api_key)
	geo_r = requests.get(freegeoip)
	geo_json = geo_r.content
	print("Response: ", geo_json)