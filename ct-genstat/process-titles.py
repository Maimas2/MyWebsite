import math
import os

titleNames = []
titleNumbers = []
titleHrefs = []

with open('./all-titles.html', 'r') as inf:
    text = inf.read()

    t1 = text.split("<span class=\"toc_ttl_desig\">")
    
    for l in t1:
        titleNumbers.append(l.split("</a>")[0].split("<")[0])
    titleNumbers.pop(0)

    t2 = text.split("<span class=\"toc_ttl_name\">")
    for l in t2:
        titleNames.append(l.split("</a>")[0].split("<")[0])
    titleNames.pop(0)

    t3 = text.split("<a href=\"")
    for l in t3:
        titleHrefs.append(l.split("\"")[0])
    titleHrefs.pop(0)

titleHrefs = list(set(titleHrefs))
titleHrefs.sort()

# These two title specifically are reserved for future use
titleNames.remove("Reserved for future use")
titleNames.remove("Reserved for future use")

titleNumbers.remove("Title 2a")
titleNumbers.remove("Title 2b")

print(len(titleHrefs))
print(len(titleNames))
# print((titleHrefs))
# print((titleNames))
print(len(titleNumbers))

# exit()

allTitleInfo = {
    'numbers' : titleNumbers,
    'names'   : titleNames
}

titlesData = {  }

allChaps = []

for fname in titleHrefs:
    # print(fname)
    # os.system("wget --no-check-certificate -P out/titles https://www.cga.ct.gov/current/pub/%s" % (fname))
    # ^ only needs to be pulled once
    try:
        with open('./out/titles/%s' % fname, 'r') as inf:
            text = inf.read()
            titleNo = text.split("<h1 class=\"title-no\">")[1].split("</h1>")[0].replace("*", "")
            titleName = text.split("<h1 class=\"title-name\">")[1].split("</h1>")[0].replace("<br/>", " ")

            chpNames = []
            chpNumbers = []
            t1 = text.split("<a class=\"toc_ch_link\" ")
            tl = []
            for l in t1:
                tl.append(l.split("</a>")[0].split(">")[1])
            for ii in range(len(tl)-1):
                if ii == 0: continue
                if ii % 2 == 1:
                    chpNumbers.append(tl[ii])
                else:
                    chpNames.append(tl[ii])

            titlesData[fname.split("_")[1].split(".")[0].lstrip("0")] = {
                "number"   : titleNo,
                "name"     : titleName,
                "fileName" : fname,
                "chpNames" : chpNames,
                "chpNumbers" : chpNumbers
            }
    except Exception as e:
        # pass
        print(e)
print(titlesData)
