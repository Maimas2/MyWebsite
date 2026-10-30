import os
for i in range(979):
    if i == 0:
        continue
    # print("https://www.cga.ct.gov/current/pub/chap_%s%s%s.htm" % ("0" if i < 100 else "", "0" if i < 10 else "", i))
    os.system("wget --no-check-certificate -P out/titles https://www.cga.ct.gov/current/pub/title_%s%s.htm" % ("0" if i < 10 else "", i))