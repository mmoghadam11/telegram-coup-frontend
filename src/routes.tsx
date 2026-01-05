import React, { Component, useContext } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import LogoutPage from "./domains/logout/pages/Logout";
import Login from "domains/login/pages/Login";
import useSessionStorageState from "hooks/useSessionStorage";
import Password from "domains/password/pages/Password";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { mainProviderContext } from "context/MainProviderContext";
import Admin from "domains/admin/pages/Admin";
import ContactNumberAuth from "domains/Authentication/ContactNumberAuth";
import NotFound from "components/errorPages/notFound/NotFound";
import { Typography } from "@mui/material";
import Welcome from "domains/welcome/Welcome";
import Towns from "domains/basic-data/Towns";
import PublicData from "domains/basic-data/PublicData/PublicData";
import CommonData from "domains/basic-data/PublicData/pages/CommonData";
import TownShipGrid from "domains/basic-data/TownShip/TownShipGrid";
import CityGrid from "domains/basic-data/CityController/CityGrid";
import FormSteps from "domains/Institute/FormSteps";
import InstititeGrid from "domains/Institute/InstititeGrid";
import UsersGrid from "domains/admin/pages/Users/UsersGrid";
import AddUser from "domains/admin/pages/Users/AddUser";
import RolesGrid from "domains/admin/pages/roles/RolesGrid";
import PermissionGrid from "domains/admin/pages/permissions/PermissionGrid";
import DetaileTabs from "domains/Institute/setting/DetaileTabs";
import MemberShipGrid from "domains/memberShip/MemberShipGrid";
import AddMembership from "domains/memberShip/AddMembership";
import WorkgroupGrid from "domains/workgroup/WorkgroupGrid";
import AddWorkgroup from "domains/workgroup/AddWorkgroup";
import PersonGrid from "domains/person/PersonGrid";
import AddPerson from "domains/person/AddPerson";
import FirmAdminGrid from "domains/firmAdmin/FirmAdminGrid";
import FirmAdminFormSteps from "domains/firmAdmin/FirmAdminFormSteps";
import FirmAdminDetaileTabs from "domains/firmAdmin/setting/FirmAdminDetaileTabs";
import OfficialUserGrid from "domains/accountant/officialUser/OfficialUserGrid";
import AddOfficialUser from "domains/accountant/officialUser/AddOfficialUser";
import InstituteContractGrid from "domains/Institute/contracts/InstituteContractGrid";
import ContractDetaile from "domains/Institute/contracts/ContractDetaile";
import InstituteFinancialStatementGrid from "domains/Institute/financialStatement/InstituteFinancialStatementGrid";
import FinancialStatementDetaile from "domains/Institute/financialStatement/FinancialStatementDetaile";
import InstituteDisciplinaryOrderGrid from "domains/Institute/disciplinaryOrder/InstituteDisciplinaryOrderGrid";
import DisciplinaryOrderDetaile from "domains/Institute/disciplinaryOrder/DisciplinaryOrderDetaile";
import AccountantDisciplinaryOrderGrid from "domains/accountant/disciplinaryOrder/AccountantDisciplinaryOrderGrid";
import AccountantDisciplinaryOrderDetaile from "domains/accountant/disciplinaryOrder/AccountantDisciplinaryOrderDetaile";
import StaffGrid from "domains/Institute/staff/StaffGrid";
import AddStaff from "domains/Institute/staff/AddStaff";
import Firms4StaffGrid from "domains/firmAdmin/staff/Firms4StaffGrid";
import FirmStaffGrid from "domains/firmAdmin/staff/FirmStaffGrid";
import AddFirmStaff from "domains/firmAdmin/staff/AddFirmStaff";
import Firms4PartnerGrid from "domains/firmAdmin/Partners/Firms4PartnerGrid";
import FirmPartnersGrid from "domains/firmAdmin/Partners/FirmPartnersGrid";
import AddFirmPartner from "domains/firmAdmin/Partners/AddFirmPartner";
import AllFirms4PartnerGrid from "domains/Institute/Partners/AllFirms4PartnerGrid";
import AllFirmPartnersGrid from "domains/Institute/Partners/AllFirmPartnersGrid";
import PartnerDataModal from "domains/Institute/Partners/PartnerDataModal";
import Firms4AccountantGrid from "domains/firmAdmin/FirmHiredAccountant/Firms4AccountantGrid";
import FirmAccountantGrid from "domains/firmAdmin/FirmHiredAccountant/FirmAccountantGrid";
import AddFirmAccountant from "domains/firmAdmin/FirmHiredAccountant/AddFirmAccountants";
import AccountantDetaileTabs from "domains/accountant/officialUser/details/DetailsTabs";
import AllDisciplinaryOrderGrid from "domains/Institute/disciplinaryOrder/AllDisciplinaryOrderGrid";
import AddCAOrganization from "domains/CAOrganization/AddCAOrganization";
import CAOrganizationGrid from "domains/CAOrganization/CAOrganizationGrid";
import AccountantUserDisciplinaryOrderDetaile from "domains/accountantUser/disciplinaryOrder/AccountantUserDisciplinaryOrderDetaile";
import Firms4EDUGrid from "domains/Institute/EDU/Firms4EDUGrid";
import ContinuingEducationGrid from "domains/Institute/EDU/continuingEducation/ContinuingEducationGrid";
import NewLogin from "domains/login/pages/NewLogin";
import CertifiedAccountantEDUGrid from "domains/accountantUser/edu/CertifiedAccountantEDUGrid";
import DirectorDisciplinaryOrderDetails from "domains/firmDirector/DirectorDisciplinaryOrderDetails";
import AccountantOfficialUserGrid from "domains/accountantUser/officialUser/AccountantOfficialUserGrid";
import AddAccountantOfficialUser from "domains/accountantUser/officialUser/AddAccountantOfficialUser";
import Accountant_DetaileTabs from "domains/accountantUser/officialUser/details/Accountant_DetaileTabs";
import DisciplinaryBasic from "domains/basic-data/disciplinary-order/DisciplinaryBasic";
import ShowDisciplinaryOrderPage from "domains/Institute/disciplinaryOrder/page/ShowDisciplinaryOrderPage";
import AllDOGrid from "domains/Institute/disciplinaryOrder/newVersion/AllDOGrid";
import AccountantUserAllDOCases from "domains/accountantUser/disciplinaryOrder/newVersion/AccountantUserAllDOCases";
import renderRoutes, { MenuItem } from "components/routeHelper/renderRoutes";
import { url } from "inspector";
import AllHCases from "domains/Institute/disciplinaryOrder/newVersion/highOrder/AllHCases";
import DirectorDisciplinayOrder from "domains/firmDirector/newVersion/DirectorDisciplinayOrder";

const AppRoutes: React.FC = () => {
  const auth = useAuth();
  const isUserLoggedIn = auth?.isUserLoggedIn ?? false;
  const MENU_ITEMS: MenuItem[] = [
    {
      title: "احکام انتظامی(new)",
      url: "/IACPA-disciplinary-order",
      access: ["administrator", "city-showmenu", "operator-showmenu"],
      menuChildren: [
        {
          title: "پرونده‌های انتظامی",
          url: "cases",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          component: <AllDOGrid />,
          menuChildren: [
            {
              url: ":id",
              component: <ShowDisciplinaryOrderPage editable={true} />,
            },
          ],
        },
        {
          title: "احکام عالی انتظامی",
          url: "final",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          component: <AllHCases />,
        },
      ],
    },
    {
      title: "احکام انتظامی مدیرعامل",
      url: "/director",
      access: ["director-showmenu"],
      menuChildren: [
        {
          title: "پرونده‌های انتظامی",
          url: "disciplinary-order",
          access: ["director-showmenu"],
          component: <DirectorDisciplinaryOrderDetails />,
          menuChildren: [{
            url:":id",
            component:<AccountantDisciplinaryOrderDetaile />
           }],
        
        },
        {
          title: "newVersion",
          url: "disciplinary-order-new",
          access: ["director-showmenu"],
          component: <DirectorDisciplinayOrder />,
        },
      ],
    },
    {
      title: "جامعه",
      url: "/IACPA",
      access: ["city-showmenu", "operator-showmenu"],
      menuChildren: [
        {
          title: "احکام انتظامی",
          url: "disciplinary-order",
          access: ["administrator", "city-showmenu", "operator-showmenu"],
          component: <AllDisciplinaryOrderGrid />,
          menuChildren: [
            {
              url: ":id",
              component: <ShowDisciplinaryOrderPage editable={true} />,
            },
          ],
        },
        {
          title: "کارگروه",
          url: "workgroup",
          access: ["administrator", "city-showmenu"],
          component: <WorkgroupGrid />,
          menuChildren: [
            {
              url: ":id",
              component: <AddWorkgroup />,
            },
          ],
        },
        {
          title: "پروانه",
          url: "license",
          access: ["administrator", "city-showmenu"],
        },
        {
          title: "شاغلین سازمان حسابرسی",
          url: "ca_organization",
          access: ["administrator", "city-showmenu"],
          component: <CAOrganizationGrid />,
        },
      ],
    },
  ];
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route
            index
            path="contactNumberAuthentication"
            element={<ContactNumberAuth />}
          />
          <Route index path="admin" element={<Admin />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="management">
            <Route path="users">
              <Route index element={<UsersGrid />} />
              <Route path=":id" element={<AddUser />} />
            </Route>
            <Route path="roles">
              <Route index element={<RolesGrid />} />
            </Route>
            <Route path="permissions">
              <Route index element={<PermissionGrid />} />
            </Route>
          </Route>
          <Route path="accountant">
            <Route path="official-users">
              <Route index element={<OfficialUserGrid />} />
              <Route path="details/:id">
                <Route index element={<AccountantDetaileTabs />} />
              </Route>
              <Route path=":id" element={<AddOfficialUser />} />
            </Route>
            <Route path="disciplinary-order">
              <Route index element={<AccountantDisciplinaryOrderGrid />} />
              <Route
                path=":id"
                element={<AccountantDisciplinaryOrderDetaile />}
              />
            </Route>
          </Route>
          {/* <Route path="/director">
            <Route path="disciplinary-order">
              <Route index element={<DirectorDisciplinaryOrderDetails />} />
              <Route
                path=":id"
                element={<AccountantDisciplinaryOrderDetaile />}
              />
            </Route>
          </Route> */}
          <Route path="accountant-user">
            <Route path="cartable">
              <Route index element={<AccountantOfficialUserGrid />} />
              <Route path="details/:id">
                <Route index element={<Accountant_DetaileTabs />} />
              </Route>
              <Route path=":id" element={<AddAccountantOfficialUser />} />
            </Route>
            <Route path="disciplinary-order">
              <Route
                index
                element={<AccountantUserDisciplinaryOrderDetaile />}
              />
              <Route
                path=":id"
                element={<AccountantDisciplinaryOrderDetaile />}
              />
            </Route>
            <Route path="disciplinary-order-new">
              <Route index element={<AccountantUserAllDOCases />} />
              {/* <Route
                path=":id"
                element={<AccountantDisciplinaryOrderDetaile />}
              /> */}
            </Route>
            <Route path="EDU">
              <Route index element={<CertifiedAccountantEDUGrid />} />
              {/* <Route
                path=":id"
                element={<AccountantDisciplinaryOrderDetaile />}
              /> */}
            </Route>
          </Route>
          <Route path="institutions">
            <Route path="information">
              <Route index element={<InstititeGrid />} />
              <Route path="details/:id">
                <Route index element={<DetaileTabs />} />
              </Route>
              <Route path=":id" element={<FormSteps />} />
            </Route>
            <Route path="persons">
              <Route index element={<StaffGrid />} />
              <Route path=":staffId" element={<AddStaff />} />
              <Route path=":id/:staffId" element={<AddStaff />} />
            </Route>
            <Route path="personnels">
              <Route index element={<MemberShipGrid />} />
              <Route path=":id" element={<AddMembership />} />
            </Route>
            <Route path="rating-test" element={<Welcome />} />
            <Route path="partners">
              <Route index element={<AllFirms4PartnerGrid />} />
              <Route path=":id">
                <Route index element={<AllFirmPartnersGrid />} />
                <Route path=":staffId" element={<PartnerDataModal />} />
              </Route>
            </Route>
            <Route path="hired-accountants">
              <Route index element={<Firms4AccountantGrid all />} />
              <Route path=":id">
                <Route index element={<FirmAccountantGrid all />} />
                <Route path=":staffId" element={<AddFirmAccountant />} />
              </Route>
            </Route>
            <Route path="EDU">
              <Route index element={<Firms4EDUGrid all />} />
              <Route path=":id">
                <Route index element={<ContinuingEducationGrid />} />
                <Route path=":staffId" element={<AddFirmAccountant />} />
              </Route>
            </Route>
            <Route path="exam-applicants" element={<Welcome />} />
            <Route path="membership-fee" element={<Welcome />} />
            <Route path="contracts-concluded">
              <Route index element={<InstituteContractGrid />} />
              <Route path=":id" element={<ContractDetaile />} />
            </Route>
            <Route path="financial-Statement">
              <Route index element={<InstituteFinancialStatementGrid />} />
              <Route path=":id" element={<FinancialStatementDetaile />} />
            </Route>
          </Route>
          <Route path="FirmAdmin">
            <Route path="information">
              <Route index element={<FirmAdminGrid />} />
              <Route path="details/:id">
                <Route index element={<FirmAdminDetaileTabs />} />
              </Route>
              <Route path=":id" element={<FirmAdminFormSteps />} />
            </Route>
            <Route path="partners">
              <Route index element={<Firms4PartnerGrid />} />
              <Route path=":id">
                <Route index element={<FirmPartnersGrid />} />
                <Route path=":staffId" element={<AddFirmPartner />} />
              </Route>
            </Route>
            <Route path="persons">
              <Route index element={<Firms4StaffGrid />} />
              <Route path="add/:id" element={<AddPerson />} />
              <Route path=":id">
                <Route index element={<FirmStaffGrid />} />
                <Route path=":staffId" element={<AddFirmStaff />} />
              </Route>
            </Route>
            <Route path="hired-accountants">
              <Route index element={<Firms4AccountantGrid />} />
              <Route path=":id">
                <Route index element={<FirmAccountantGrid />} />
                <Route path=":staffId" element={<AddFirmAccountant />} />
              </Route>
            </Route>
            <Route path="EDU">
              <Route index element={<Firms4EDUGrid />} />
              <Route path=":id">
                <Route index element={<ContinuingEducationGrid />} />
                <Route path=":staffId" element={<AddFirmAccountant />} />
              </Route>
            </Route>
          </Route>

          {renderRoutes(MENU_ITEMS)}
          {/* <Route path="IACPA">
            <Route path="disciplinary-order">
              <Route index element={<AllDisciplinaryOrderGrid />} />
              <Route
                path=":id"
                element={<ShowDisciplinaryOrderPage editable={true} />}
              />
            </Route>
            <Route path="disciplinary-order-new">
              <Route index element={<AllDOGrid />} />
              <Route
                path=":id"
                element={<ShowDisciplinaryOrderPage editable={true} />}
              />
            </Route>
            <Route path="workgroup">
              <Route index element={<WorkgroupGrid />} />
              <Route path=":id" element={<AddWorkgroup />} />
            </Route>
            <Route path="ca_organization">
              <Route index element={<CAOrganizationGrid />} />
            </Route>
          </Route> */}
          <Route path="basic-data">
            <Route path="disciplinary-order" element={<DisciplinaryBasic />} />
            <Route path="persons">
              <Route index element={<PersonGrid />} />
              <Route path=":id" element={<AddPerson />} />
            </Route>
            <Route path="towns" element={<Towns />} />
            <Route path="township" element={<TownShipGrid />} />
            <Route path="city" element={<CityGrid />} />
            <Route path="public-data">
              <Route index element={<PublicData />} />
              <Route path=":id/:typeName" element={<CommonData />} />
            </Route>
          </Route>
          <Route path="/" element={<Welcome />} />
        </Route>

        <Route path="contract" element={<RemoveContract />} />
      </Route>

      <Route path="welcome" element={<Welcome />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route
        path="login"
        // element={isUserLoggedIn ? <Navigate to="/" /> : <Login />}
        element={isUserLoggedIn ? <Navigate to="/" /> : <NewLogin />}
      />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default AppRoutes;

type ProtectedRouteProps = {
  redirectPath?: string;
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
  children,
}) => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorageState("token");

  // React.useEffect(() => {
  //   if (window.location.pathname === "/" && window.location.search.length > 10) {
  //     const params = new URLSearchParams(window.location.search);
  //     const tokenFromUrl = params.get("token") ?? "";

  //     if (tokenFromUrl) {
  //       auth?.storeToken(tokenFromUrl);
  //       setToken(tokenFromUrl);
  //       navigate("/", { replace: true });
  //     }
  //   }
  // }, [auth, navigate, setToken]);

  if (!auth?.isUserLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // if (!access?.roleName?.length) {
  //   return <TavanaSpinner show />;
  // }

  return <>{children ?? <Outlet />}</>;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { access } = useContext(mainProviderContext);

  if (access?.accessMenu?.[0] === "administrator" && access.admin) {
    return <Layout>{children ?? <Outlet />}</Layout>;
  }

  return <Navigate to="/" replace />;
};
const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <Layout>{children ?? <Outlet />}</Layout>;
};

const RemoveContract: React.FC = () => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);

  React.useEffect(() => {
    if (auth?.isContractSet()) {
      auth.setContract(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        null,
        null,
        null,
        false,
        false,
        false,
        ""
      );
    }
  }, [auth]);

  return (
    <Layout hideRightMenu={!access.admin}>
      <Typography>خروجی</Typography>
    </Layout>
  );
};
