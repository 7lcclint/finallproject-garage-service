import ChartBox from '../../chartBox/ChartBox'
import TopBox from '../../topBox/TopBox.jsx'
import './summary.css'
import {
  barChartBoxVisit,
  chartBoxUser,
} from "../../data";
import BarChartBox from '../../barChartBox/BarChartBox';
import PieChartBox from '../../pieCartBox/PieChartBox';
import BigChartBox from '../../bigChartBox/BigChartBox';

const Summary = () => {
  return (
    <div className="summary">
      <div className="box box1"><TopBox/></div>
      <div className="box box2"><ChartBox {...chartBoxUser} /></div>
      <div className="box box3"><ChartBox {...chartBoxUser} /></div>
      <div className="box box4"><PieChartBox/></div>
      <div className="box box5"><ChartBox {...chartBoxUser} /></div>
      <div className="box box6"><ChartBox {...chartBoxUser} /></div>
      <div className="box box7"><BigChartBox/></div>
      <div className="box box8"><BarChartBox {...barChartBoxVisit} /></div>
      <div className="box box9"><BarChartBox {...barChartBoxVisit} /></div>
    </div>
  )
}

export default Summary
