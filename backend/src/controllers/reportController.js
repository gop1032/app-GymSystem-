import { successResponse } from '../utils/response.js'
import { getAttendanceReport, getDashboardSummary, getRevenueReport } from '../services/reportService.js'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

export async function dashboardReportController(_req, res, next) {
  try {
    const summary = await getDashboardSummary()
    return successResponse(res, summary, 'Resumen del dashboard')
  } catch (error) {
    return next(error)
  }
}

export async function revenueReportController(req, res, next) {
  try {
    const report = await getRevenueReport(req.query)
    return successResponse(res, report, 'Reporte de ingresos')
  } catch (error) {
    return next(error)
  }
}

export async function attendanceReportController(req, res, next) {
  try {
    const report = await getAttendanceReport(req.query)
    return successResponse(res, report, 'Reporte de asistencias')
  } catch (error) {
    return next(error)
  }
}

export async function pdfReportController(req, res, next) {
  try {
    const { type } = req.query
    const isRevenue = type === 'revenue'
    const data = isRevenue ? await getRevenueReport(req.query) : await getAttendanceReport(req.query)

    const doc = new PDFDocument({ margin: 50 })
    const buffers = []
    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=report-${type}.pdf`)
      res.send(pdfData)
    })

    // --- Header ---
    doc.rect(0, 0, doc.page.width, 100).fill('#0d1629') // Dark background
    doc.fillColor('#fbbf24').fontSize(24).font('Helvetica-Bold').text('GYM SYSTEM', 50, 40)
    
    const title = isRevenue ? 'Reporte de Ingresos Financieros' : 'Reporte de Asistencias de Clientes'
    doc.fillColor('#9ca3af').fontSize(12).font('Helvetica').text(title, 50, 65)
    
    doc.fillColor('#ffffff').fontSize(10).text(`Generado: ${new Date().toLocaleString()}`, doc.page.width - 200, 50, { width: 150, align: 'right' })

    // --- Content ---
    doc.moveDown(4)
    doc.fillColor('#000000') // Reset for body

    if (data.length === 0) {
      doc.fontSize(12).text('No hay registros para mostrar en este reporte.', { align: 'center' })
    } else {
      let y = 140
      // Table Headers
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#fbbf24')
      doc.rect(50, y, doc.page.width - 100, 20).fill('#1f2937')
      doc.fillColor('#ffffff')

      if (isRevenue) {
        doc.text('RECIBO', 60, y + 5, { width: 80 })
        doc.text('CLIENTE', 150, y + 5, { width: 150 })
        doc.text('FECHA', 310, y + 5, { width: 100 })
        doc.text('METODO', 420, y + 5, { width: 60 })
        doc.text('MONTO (S/.)', 490, y + 5, { width: 60 })
        y += 25

        // Rows
        doc.font('Helvetica').fillColor('#374151')
        data.forEach((item, i) => {
          if (y > doc.page.height - 100) { doc.addPage(); y = 50; }
          // Alternating row background
          if (i % 2 !== 0) { doc.rect(50, y - 5, doc.page.width - 100, 20).fill('#f9fafb'); doc.fillColor('#374151') }

          doc.text(item.receiptNumber, 60, y, { width: 80 })
          doc.text(item.client?.name || 'Cliente general', 150, y, { width: 150 })
          doc.text(new Date(item.date).toLocaleDateString(), 310, y, { width: 100 })
          doc.text(item.method, 420, y, { width: 60 })
          doc.fillColor('#059669').text(Number(item.amount).toFixed(2), 490, y, { width: 60 })
          doc.fillColor('#374151')
          y += 20
        })
      } else {
        doc.text('SOCIO', 60, y + 5, { width: 150 })
        doc.text('FECHA', 220, y + 5, { width: 80 })
        doc.text('ENTRADA', 310, y + 5, { width: 80 })
        doc.text('SALIDA', 400, y + 5, { width: 80 })
        doc.text('FUENTE', 490, y + 5, { width: 60 })
        y += 25

        // Rows
        doc.font('Helvetica').fillColor('#374151')
        data.forEach((item, i) => {
          if (y > doc.page.height - 100) { doc.addPage(); y = 50; }
          if (i % 2 !== 0) { doc.rect(50, y - 5, doc.page.width - 100, 20).fill('#f9fafb'); doc.fillColor('#374151') }

          doc.text(item.client?.name || '-', 60, y, { width: 150 })
          doc.text(new Date(item.date).toLocaleDateString(), 220, y, { width: 80 })
          doc.text(new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 310, y, { width: 80 })
          doc.text(item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'En sala', 400, y, { width: 80 })
          doc.text(item.source, 490, y, { width: 60 })
          y += 20
        })
      }
    }

    doc.end()
    return null
  } catch (error) {
    return next(error)
  }
}

export async function excelReportController(req, res, next) {
  try {
    const { type } = req.query
    const isRevenue = type === 'revenue'
    const data = isRevenue ? await getRevenueReport(req.query) : await getAttendanceReport(req.query)

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Reporte Gym System')

    // Titulo
    sheet.mergeCells('A1:E2')
    const titleCell = sheet.getCell('A1')
    titleCell.value = isRevenue ? 'GYM SYSTEM - REPORTE DE INGRESOS' : 'GYM SYSTEM - REPORTE DE ASISTENCIAS'
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFBBF24' } }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1629' } }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }

    sheet.addRow([])

    if (isRevenue) {
      sheet.columns = [
        { header: 'RECIBO', key: 'receiptNumber', width: 20 },
        { header: 'CLIENTE', key: 'client', width: 30 },
        { header: 'FECHA', key: 'date', width: 15 },
        { header: 'MÉTODO', key: 'method', width: 15 },
        { header: 'MONTO (S/.)', key: 'amount', width: 15 }
      ]

      data.forEach(item => {
        sheet.addRow({
          receiptNumber: item.receiptNumber,
          client: item.client?.name || 'Cliente general',
          date: new Date(item.date).toLocaleDateString(),
          method: item.method,
          amount: Number(item.amount)
        })
      })

      sheet.getColumn('amount').numFmt = '"S/."#,##0.00'
    } else {
      sheet.columns = [
        { header: 'SOCIO', key: 'client', width: 30 },
        { header: 'FECHA', key: 'date', width: 15 },
        { header: 'ENTRADA', key: 'checkIn', width: 15 },
        { header: 'SALIDA', key: 'checkOut', width: 15 },
        { header: 'FUENTE', key: 'source', width: 15 }
      ]

      data.forEach(item => {
        sheet.addRow({
          client: item.client?.name || '-',
          date: new Date(item.date).toLocaleDateString(),
          checkIn: new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checkOut: item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'En sala',
          source: item.source
        })
      })
    }

    // Estilos para las cabeceras
    const headerRow = sheet.getRow(4)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=report-${type}.xlsx`)

    await workbook.xlsx.write(res)
    res.end()
    return null
  } catch (error) {
    return next(error)
  }
}
