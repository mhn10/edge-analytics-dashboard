import platform, psutil 
import geocoder

def getNodeInfo():
    node_details = dict()
        
    Node location
    node_details['location'] = geocoder.ip('me').latlng

    # Get machine details
    node_details['Aarchitecture'] = platform.machine()
    node_details['OS'] = platform.system()
    node_details['OS_Version'] = platform.release()

    # Get cpu info
    node_details['cpu_percent'] = psutil.cpu_percent()
    node_details['cpu_count'] = psutil.cpu_count()
    memory = psutil.virtual_memory()

    node_details['total_memory'] = round (memory.total / ( 1024 * 1024 * 1024 ), 2)
    node_details['memory_used'] = round (memory.used / ( 1024 * 1024 * 1024 ), 2)
    node_details['memory_available'] = round (memory.available / ( 1024 * 1024 * 1024 ), 2)

    temps =  psutil.sensors_temperatures()
    detail = []
    
    for key, value in temps.items():
        for val in value:
            f = val._fields
            temp = {}
            for n, k in zip( f, val ) :
                if n == 'label':
                    temp[n] = key + '-' + k
                else:
                    temp[n] = k
            
            detail.append( temp )

    node_details['temperatue'] = detail

    return node_details
