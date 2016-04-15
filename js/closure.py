#!usr/bin/python

"""feed the uncompressed js code to the Google closure compiler and get back compiled js
    run : python closure.py fileNames with spaces(without .js extension, parsing is painful and I am lazy :p) """

import httplib, urllib, sys, os.path

def getCode(fileName):

    try:
        tempInFile = fileName + ".js"
        inFile = open(tempInFile, "r")

        jsCode = inFile.read()

        inFile.close()

        return jsCode

    except Exception, e:
        print "File not found"

def compileCode(uncompiledCode):

    try:
        params = urllib.urlencode([
                ('js_code', uncompiledCode),
                ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
                ('language', 'ECMASCRIPT5'),
                ('output_format', 'text'),
                ('output_info', 'compiled_code'),
        ])


        headers = { "Content-type": "application/x-www-form-urlencoded" }
        conn = httplib.HTTPConnection('closure-compiler.appspot.com')
        conn.request('POST', '/compile', params, headers)
        response = conn.getresponse()
        data = response.read()
        conn.close()
        return data

    except Exception, e:
        print "Could not compile"


def writeCode(fileName, response):
    tempOutFile = fileName + ".min.js"

    try:
        if os.path.isfile(tempOutFile):
            answer = str(raw_input(tempOutFile + " already exists, have you checked your sanity level?('y' or 'n' please):"))

            if answer == "y":
                outF = open(tempOutFile, "w")
                outF.write(response)
                outF.close()
            else:
                print "please go to bed"

        else:
            outF = open(tempOutFile, "w")
            outF.write(response)
            outF.close()
    
    except Exception, e:
        print e


def main(fileName):
    jsCode = getCode(fileName)
    compiled = compileCode(jsCode)
    writeCode(fileName, compiled)
    print "Successfully compiled " + fileName + ".js"


if __name__ == '__main__':

    files = len(sys.argv)

    for x in xrange(1,files):
        main(str(sys.argv[x]))