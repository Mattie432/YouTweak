import os
import zipfile

versionNum = ""
buildPath = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, "build/")) + "/"


def increaseVersionNumber():
    fpath = os.path.abspath(os.path.join(os.path.dirname(__file__), "chrome/manifest.json"))
    print(fpath)
    linesOut =[]
    fileIn = open(fpath, "r+")
    for fileLine in fileIn:
        if '"version":' in fileLine:
            #found version line
            lineParts = fileLine.split(":")

            versionNum = lineParts[1].replace(',', '')[:-2].upper()
            versionNum = lineParts[1].replace(' ', '')[:-2].upper()
            versionNum = lineParts[1].replace('"', '')[:-2].upper()
            versionNum = versionNum.rstrip()
            versionNum = float(versionNum)
            versionNum += 0.001
            versionNum = format(versionNum, ".3f")
            print ("New version number: " + versionNum)
            newLine = lineParts[0] + ': "' + str(versionNum) + '",\n'
            linesOut.append(newLine)
        else:
            linesOut.append(fileLine)
    fileIn.close()
    fileOut = open(fpath, "w")
    #Write all the lines of text to the file
    fileOut.writelines(linesOut)
    #We are finished, close the file
    fileOut.close()

def createChromeZipFile():
    print("Creating chrome zip file")
    zipf = zipfile.ZipFile(buildPath + 'Chrome_YouTweak.zip', 'w')
    zipdir('chrome/', zipf)
    zipf.close()

def zipdir(path, zip):
    for root, dirs, files in os.walk(path):
        for file in files:
            zip.write(os.path.join(root, file))

increaseVersionNumber()
createChromeZipFile()
