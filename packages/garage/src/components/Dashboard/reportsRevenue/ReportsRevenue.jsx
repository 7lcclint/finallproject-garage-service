import { useEffect, useState } from 'react';
import './reportsRevenue.css';
import { DataGrid } from '@mui/x-data-grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/th';
import dayjs from 'dayjs';

function ReportsRevenue() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const columns = [
        { field: 'repair_date', headerName: 'วันที่', flex: 2 },
        { field: 'revenue', headerName: 'รายรับ', flex: 2 }
    ];

    useEffect(() => {
        if (startDate && endDate) {
            const formattedStartDate = startDate.format('YYYY-M-D')
            const formattedEndDate = endDate.format('YYYY-M-D')
            console.log('********************************')
            console.log('formattedStartDate',formattedStartDate)
            console.log('formattedEndDate',formattedEndDate)

            fetch(`http://garage.thammadalok.com/api/reportRevenueByStartEnd?start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
                .then(response => response.json())
                .then(data => {
                    const reportDataWithIds = data.map((row, index) => ({
                        ...row,
                        id: index,
                        repair_date: dayjs(row.repair_date).format('DD/MM/YYYY')
                    }));
                    setReportData(reportDataWithIds);
                })
                .catch(error => {
                    console.error('พบข้อผิดพลาดในการดึงข้อมูล: ' + error);
                });
        }
    }, [startDate, endDate]);

    return (
        <>
            <div className="col">
                <h1 className='mt-4'>รายงานรายรับ</h1>
            </div>
            <div className='data-container'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="วันที่เริ่มต้น"
                            value={startDate}
                            onChange={date => setStartDate(date)}
                        />
                        <DatePicker
                            label="วันที่สิ้นสุด"
                            value={endDate}
                            minDate={startDate}
                            onChange={date => setEndDate(date)}
                        />
                    </DemoContainer>
                </LocalizationProvider><br />
                <DataGrid
                    className='data-gird'
                    disableRowSelectionOnClick
                    rows={reportData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </>
    )
}

export default ReportsRevenue;
