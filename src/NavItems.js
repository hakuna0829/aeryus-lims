import React from 'react';
import { Dashboard, Users, Inventory, Test, Settings, Chart, TestManager, NotificationBell } from 'icons';
import Results from 'icons/Results';
import Doctor from 'icons/Doctor';
import TestTechnician from 'icons/TestTechnician';

export default [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Dashboard />,
    module_name: 'Dashboard',
    show: true,
    expanded: false,
  },
  {
    title: 'Client Manager',
    icon: <Users />,
    module_name: 'SiteManager',
    show: true,
    expanded: false,
    children: [
      {
        title: 'Client A',
        href: '/site-manager/location-manager',
      },
      {
        title: 'Client B',
        href: '/site-manager/department-manager',
      },
      // {
      //   title: 'Populations',
      //   href: '/site-manager/population-manager',
      // },
      // {
      //   title: 'Shift Manager',
      //   href: '/site-shift-manager',
      // }
    ]
  },
  {
    title: 'Population',
    icon: <Users />,
    module_name: 'UserManager',
    show: true,
    expanded: false,
    children: [
      {
        title: 'Employees',
        href: '/user-list/Employees',
      },
      {
        title: 'Patients',
        href: '/user-list/Patients',
      },
      {
        title: 'Visitors',
        href: '/user-list/Visitors',
      },
      {
        title: 'Vendors',
        href: '/user-list/Vendors',
      },
      {
        title: 'All Populations',
        href: '/user-list/All',
      },
      {
        title: 'Trash',
        href: '/user-list/Trash',
      },
    ]
  },
  {
    title: 'Inventory Manager',
    icon: <Inventory />,
    module_name: 'InventoryManager',
    show: true,
    expanded: false,
    href: '/inventory-manager'
  },
  {
    title: 'Lab Manager',
    icon: <Test />,
    module_name: 'LabManager',
    show: true,
    expanded: false,
    children: [
      {
        title: 'Test Tracker',
        href: '/order-tracker',
      },
      // {
      //   title: 'Results Manager',
      //   href: '/results-manager',
      // },
      // {
      //   title: 'Invoicing',
      //   href: '/invoicing',
      // },
      // {
      //   title: 'PCR',
      //   children: [
      //     {
      //       title: 'Completed',
      //       href: '/lab-pcr-completed',
      //     },
      //     {
      //       title: 'Pending',
      //       href: '/lab-pcr-pending',
      //     }
      //   ]
      // },
      // {
      //   title: 'Serology',
      //   children: [
      //     {
      //       title: 'Completed',
      //       href: '/lab-serology-completed',
      //     },
      //     {
      //       title: 'Pending',
      //       href: '/lab-serology-pending',
      //     }
      //   ]
      // },
      // {
      //   title: 'Analytics',
      //   href: '/lab-analytics',
      // }
    ]
  },
  {
    title: 'Results Manager',
    href: '/results-manager/All',
    icon: <Results />,
    module_name: 'ResultsManager',
    show: true,
    expanded: false,
  },
  {
    title: 'Appointment Manager',
    icon: <TestManager />,
    module_name: 'AppointmentManager',
    show: true,
    expanded: false,
    children: [
      {
        title: 'Monthly',
        href: '/appointment-manager/monthly',
      },
      {
        title: 'Weekly',
        href: '/appointment-manager/weekly',
      },
      {
        title: 'Daily',
        href: '/appointment-manager/today',
      },
    ]
  },
  {
    title: 'Control Center',
    icon: <Settings style={{ width: 18 }} />,
    module_name: 'ControlCenter',
    show: true,
    expanded: false,
    children: [
      {
        title: 'Account Manager',
        href: '/control-center/account-manager',
        // href: '/account-list',
      },
      {
        title: 'Role Manager',
        href: '/control-center/role-manager',
      },
      {
        title: 'Alert Setting',
        href: '/control-center/alerts',
      },
      {
        title: 'System Settings',
        href: '/control-center/system-setting',
      },
      {
        title: 'Form  Settings',
        href: '/control-center/form-setting',
      },
      {
        title: 'Audit History',
        href: '/control-center/audit-history',
      },
      // {
      //   title: 'Communications',
      //   children: [
      //     {
      //       title: 'Email',
      //       href: '/control-communication-email',
      //     },
      //     {
      //       title: 'SMS',
      //       href: '/control-communication-sms',
      //     }
      //   ]
      // }
    ]
  },
  {
    title: 'Reporting',
    icon: <Chart style={{ width: 22 }} />,
    module_name: 'Reporting',
    show: true,
    expanded: false,
    children: [
      // {
      //   title: 'Analytics',
      //   href: '/reporting-analytics',
      // },
      {
        title: 'Compliance',
        href: '/reporting/compliance',
      },
      {
        title: 'Site Statistics',
        href: '/reporting/site',
      },
      {
        title: 'Lab Manager',
        href: '/reporting/lab',
      },
      {
        title: 'User Manager',
        href: '/reporting/user',
      },
      {
        title: 'Inventory Manager',
        href: '/reporting/inventory',
      }
    ]
  },
  {
    title: 'Alerts',
    href: '/alerts/appointment',
    icon: <NotificationBell />,
    module_name: 'Alerts',
    show: true,
    expanded: false,
  },
  {
    title: 'Provider',
    icon: <Doctor />,
    module_name: 'ProviderDoctor',
    show: false,
    expanded: false,
  },
  {
    title: 'Test Technician',
    icon: <TestTechnician />,
    href: '/user-list',
    module_name: 'TestTechnician',
    show: false,
    expanded: false,
  },
];
