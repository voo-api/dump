from torrequest import TorRequest
import os
import datetime

target_dates = [
    ("2017-07-27", "2017-07-31"),
    ("2017-07-28", "2017-08-01"),
    ("2017-08-09", "2017-08-13"),
    ("2017-08-10", "2017-08-14"),
    ("2017-08-11", "2017-08-15")
]
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
