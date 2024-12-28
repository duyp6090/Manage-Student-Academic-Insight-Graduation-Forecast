import Dashboard from "../pages/Dashboard";
import Students from "~/pages/Students";
import Login from "~/pages/Login";
import StudentDetails from "~/pages/StudentDetails";
export interface Route {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType | null;
}

const publicRoutes: Route[] = [
  { path: "/", component: Dashboard },
  { path: "/students", component: Students },
  { path: "/students/:id", component: StudentDetails },
  
];

const privateRoutes: Route[] = [
  { path: "/login", component: Login, layout: null },
]

export {publicRoutes, privateRoutes}
