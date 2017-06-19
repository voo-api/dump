from torrequest import TorRequest
import os
import datetime
from dateutil.rrule import rrule, DAILY

target_dates = []
targets = ["POA","FLN","CWB","SAO","CGR","SSA","RIO","PMW","SLZ","VIX","BHZ","CGB","GYN","MAO","BSB","RBR","BEL","BVB","PVH","THE","MCP","FOR","NAT","REC","AJU","MCZ","JPA"]
now = datetime.datetime.now()
target_url = os.environ['PROVIDER_ENDPOINT_TEMPLATE']
fake_user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

def create_delta_tuple(dt, days):
    tuples = []
    for day in days:
        tuples.append( (dt.strftime("%Y-%m-%d"), (dt + datetime.timedelta(days=day)).strftime("%Y-%m-%d")) )
    return tuples

for dt in rrule(DAILY, dtstart= now + datetime.timedelta(days=1), until=now + datetime.timedelta(days=120)):    
    if dt.weekday() == 3:
        target_dates.extend(create_delta_tuple(dt, [3,4,5]))

    if dt.weekday() == 4:
        target_dates.extend(create_delta_tuple(dt, [2,3,4,5]))

    if dt.weekday() == 5:
        target_dates.extend(create_delta_tuple(dt, [2,3,4]))


data_directory = "data"
if not os.path.exists(data_directory):
    os.makedirs(data_directory)

with TorRequest() as tr:
    tr.reset_identity()
    for (startdate,enddate) in target_dates:
        response = tr.get(target_url.format(startdate, enddate),headers = {'user-agent': fake_user_agent})
        if response.status_code == 200:
            request_directory = data_directory + "/{0}/{1}".format(startdate, enddate)
            if not os.path.exists(request_directory):
                os.makedirs(request_directory)            
            data = open(request_directory + "/flight-{0}.json".format(now.isoformat()), "w")
            data.write(response.text.encode('ascii', 'ignore').decode('ascii'))
            data.close()
        else:
            print "Error: "
            print response.status_code
            print response.text
            tr.reset_identity()
