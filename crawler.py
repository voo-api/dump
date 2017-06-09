from torrequest import TorRequest
import os
import datetime

target_dates = [
    ("2017-06-29", "2017-07-03"),
    ("2017-06-30", "2017-07-04"),
    ("2017-07-13", "2017-07-17"),
    ("2017-07-14", "2017-07-18"),
    ("2017-07-27", "2017-07-31"),
    ("2017-07-28", "2017-08-01")
]
target_url = 'https://www.decolar.com/shop/flights/data/search/roundtrip/poa/rio/{0}/{1}/1/0/0/TOTALFARE/ASCENDING/NA/NA/NA/NA/NA'
fake_user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

directory = "data/" + datetime.datetime.now().isoformat()
if not os.path.exists(directory):
    os.makedirs(directory)

with TorRequest() as tr:
    for (startdate,enddate) in target_dates:
        response = tr.get(target_url.format(startdate, enddate),headers = {'user-agent': fake_user_agent})
        data = open(directory + "/flight-{0}-{1}.json".format(startdate, enddate), "w")
        data.write(response.text.encode('ascii', 'ignore').decode('ascii'))
        data.close()
