import os

for i in range(979):
    if i == 0:
        continue
    # print("https://www.cga.ct.gov/current/pub/chap_%s%s%s.htm" % ("0" if i < 100 else "", "0" if i < 10 else "", i))
    for c in ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'z']:
        # print("wget --no-check-certificate -P out https://www.cga.ct.gov/current/pub/chap_%s%s%s%s.htm" % ("0" if i < 100 else "", "0" if i < 10 else "", i, c))
        os.system("wget --no-check-certificate -P out https://www.cga.ct.gov/current/pub/chap_%s%s%s%s.htm" % ("0" if i < 100 else "", "0" if i < 10 else "", i, c))