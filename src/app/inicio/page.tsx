 import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/dashboard.css";
import {
  MessageCircle,
  CheckCircle,
  Clock,
  CalendarCheck
} from "lucide-react";




export default function DashboardPage() {
  return (
    <> 
       
      

      <section className="dashboard">
        

        {/* MÉTRICAS SUPERIORES */}
        <div className="dashboard-cards">
          <div className="card card-blue">
            <div className="card-icon">
              <MessageCircle />
            </div>
            <span className="card-label">Mail</span>
            <strong className="card-value">educadorcaninodaniel@gmail.com </strong>  
          </div>

          <div className="card card-green">
            <div className="card-icon">
              <CheckCircle />
            </div>
            <span className="card-label">Teléfono</span>
            <strong className="card-value">+541162140147  </strong>  
          </div>

          

           
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="dashboard-bottom">

           

          {/* ACTIVIDAD RECIENTE */}
          <div className="panel panel-full">
            <h2 className="panel-title"> Monitoreos en tiempo real</h2>
            <ul className="activity-feed">
              <li>🟢  Al servicio de la Comunidad</li>
               
              
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
