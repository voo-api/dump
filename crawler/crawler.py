from torrequest import TorRequest
import os
import datetime
from dateutil.rrule import rrule, DAILY

target_dates = []

for dt in rrule(DAILY, dtstart=datetime.datetime.now() + datetime.timedelta(days=1), until=datetime.datetime.now() + datetime.timedelta(days=90)):
    if dt.weekday() >= 3 or dt.weekday() <= 5:
        first_enddate = dt + datetime.timedelta(days=3)
        second_enddate = dt + datetime.timedelta(days=4)
        third_enddate = dt + datetime.timedelta(days=5)

        target_dates.append( (dt.strftime("%Y-%m-%d"), first_enddate.strftime("%Y-%m-%d")) )
        target_dates.append( (dt.strftime("%Y-%m-%d"), second_enddate.strftime("%Y-%m-%d")) )
        target_dates.append( (dt.strftime("%Y-%m-%d"), third_enddate.strftime("%Y-%m-%d")) )

target_url = os.environ['PROVIDER_ENDPOINT_TEMPLATE']
fake_user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

data_directory = "data" #+
if not os.path.exists(data_directory):
    os.makedirs(data_directory)

with TorRequest() as tr:
    for (startdate,enddate) in target_dates:
        response = tr.get(target_url.format(startdate, enddate),headers = {'user-agent': fake_user_agent})
        request_directory = data_directory + "/{0}/{1}".format(startdate, enddate)
        if not os.path.exists(request_directory):
            os.makedirs(request_directory)
        data = open(request_directory + "/flight-{0}.json".format(datetime.datetime.now().isoformat()), "w")
        data.write(response.text.encode('ascii', 'ignore').decode('ascii'))
        data.close()
