from flask import Flask, render_template, request
import sqlite3
import re


app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return render_template("index.html")

@app.route('/home')
def home():
    return hello_world()

@app.route('/table/<int:page>')
def table(page):
    conn = sqlite3.connect('jobs.db')
    cursor = conn.cursor()
    data = cursor.execute('select * from t_jobs limit %s, %s'%(str((page - 1) * 50), 50))
    datalist = [item for item in data]
    print(datalist)
    cursor.close()
    conn.close()
    return render_template('table.html', datalist=datalist, current_page=page)

@app.route('/rate')
def rateHTML():
    return render_template('rate.html')



def empty_filter(member):
    item = member[0]
    return re.sub(r'\s', '', item)

@app.route('/rate/bar/<string:group>')
def rate_bar(group):
    conn = sqlite3.connect('jobs.db')
    cursor = conn.cursor()
    data = cursor.execute('select %s, count(*) from t_jobs_3 group by %s'%(group, group))
    datalist = [item for item in data]
    cursor.close()
    conn.close()
    datalist = list(filter(empty_filter, datalist)) #处理空值
    if group == 'salary':
        def to_sort(one):
            item = one[0]
            number = re.search(r'(\d+(\.\d)?)-', item).group(1)
            # print(item, number)
            if item[-1::1] == '年':
                return float(number)*10/12
            else:
                if item[-3:-2:1] == '千':
                    return float(number)
                else:
                    return float(number)*10
        datalist.sort(key=to_sort, reverse=False)
    for data in datalist:
        print(data)
    xVals = [item[0] for item in datalist]
    yVals = [item[1] for item in datalist]
    return {'xVals': xVals, 'yVals': yVals}


@app.route('/rate/fan/<string:group>')
def rate_fan(group):
    conn = sqlite3.connect('jobs.db')
    cursor = conn.cursor()
    data = cursor.execute('select %s, count(*) from t_jobs_3 group by %s'%(group, group))
    datalist = [item for item in data]
    cursor.close()
    conn.close()
    datalist = list(filter(empty_filter, datalist)) #处理空值
    # if group == 'salary':
    #     def to_sort(one):
    #         item = one[0]
    #         number = re.search(r'(\d+(\.\d)?)-', item).group(1)
    #         # print(item, number)
    #         if item[-1::1] == '年':
    #             print(item, float(number)*10/12)
    #             return float(number)*10/12
    #         else:
    #             if item[-3:-2:1] == '千':
    #                 print(item, float(number))
    #                 return float(number)
    #             else:
    #                 print(item, float(number)*10)
    #                 return float(number)*10
    #     datalist.sort(key=to_sort, reverse=False)
    resultList = []
    for item in datalist:
        item_dict = {'value': item[1], 'name': item[0]}
        resultList.append(item_dict)
    return {'datalist': resultList}




if __name__ == '__main__':
    app.run()
