const ExcelJS = require('exceljs');


module.exports.parseExcel = async function parseExcel(target_path) {
    const workbook = new ExcelJS.Workbook()
    let workbook_json = {}
    await new Promise((res, rej) => {
        workbook.xlsx.readFile(target_path)
            .then(function () {
                res(workbook)
            });
    })

    var worksheets = workbook.worksheets;
    worksheets.forEach(sheet => {
        let d = parseSheet(sheet)
        for (var key in d) {
            workbook_json[key] = d[key]
        }

    });
    return workbook_json
}


function parseSheet(worksheet) {
    let node_name = worksheet.name.split("-")[1]
    let filed1 = worksheet.getRow(2).getCell(1).toString().split("-")[1]
    let filed2 = worksheet.getRow(2).getCell(2).toString().split("-")[1]
    let filed3 = worksheet.getRow(2).getCell(3).toString().split("-")[1]
    let sheet_data = []
    let sheet_json = {}

    for (var i = 3; i <= worksheet.actualRowCount; i++) {
        row_data = {}
        //process.stdout.write(worksheet.getRow(i).getCell(1).toString());
        //console.log() 
        if (filed1) {
            row_data[filed1] = worksheet.getRow(i).getCell(1).toString()
        }
        if (filed2) {
            row_data[filed2] = worksheet.getRow(i).getCell(2).toString()
        }
        if (filed3) {
            let _images = worksheet.getRow(i).getCell(3).toString().split(',')
            let images = _images.map((image) => {
                return image.trim();
            }) 
            if (images.length && images[0]!=''){
                row_data[filed3] = images 
            }
        }
        sheet_data.push(row_data)
    }
    sheet_json[node_name] = sheet_data
    return sheet_json
}