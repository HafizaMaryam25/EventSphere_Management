import React, { useState, useEffect } from 'react';
import axios from '../../lib/api';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';

import {
  TrendingUp,
  Users,
  Calendar,
  Layers,
  BarChart3,
  Activity,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  '#d100a0',
  '#7210a6',
  '#a21caf',
  '#c026d3',
  '#ec4899',
  '#8b5cf6',
];

const BOOTH_STATUS_COLORS = {
  Available: '#10b981',
  Pending: '#f59e0b',
  Booked: '#d100a0',
  Rejected: '#ef4444',
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
}) => {
  const isPositive = trend >= 0;

  return (
    <div
      className="
        group
        relative
        min-w-0
        min-h-[190px]
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/[0.045]
        backdrop-blur-xl
        text-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#d100a0]/50
        hover:bg-white/[0.07]
        hover:shadow-[0_0_35px_rgba(209,0,160,0.25)]
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-[#d100a0]/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-[#d100a0]/20
        "
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6">

        {/* Top row */}
        <div className="flex items-start justify-between gap-4">

          {/* Label */}
          <div className="min-w-0 pr-2">
            <p
              className="
                text-sm
                font-semibold
                leading-6
                tracking-wide
                text-gray-300
              "
            >
              {label}
            </p>
          </div>

          {/* Icon */}
          <div
            className="
              flex
              h-14
              w-14
              flex-shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-white/15
              bg-gradient-to-br
              from-[#d100a0]
              via-[#a21caf]
              to-[#6b21a8]
              shadow-[0_0_22px_rgba(209,0,160,0.45)]
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            <Icon
              size={24}
              strokeWidth={2}
              className="text-white"
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="mt-8">

          <h3
            className="
              text-4xl
              font-black
              leading-none
              tracking-tight
              text-white
              drop-shadow-md
            "
          >
            {value}
          </h3>

          {trend !== undefined && (
            <div
              className={`
                mt-3
                flex
                items-center
                gap-1.5
                text-[11px]
                font-bold
                uppercase
                tracking-wide
                ${
                  isPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }
              `}
            >
              {isPositive ? (
                <ArrowUpRight size={14} strokeWidth={2.5} />
              ) : (
                <ArrowDownRight size={14} strokeWidth={2.5} />
              )}

              <span>
                {Math.abs(trend)}% from last month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   CHART CARD
========================================================= */

const ChartCard = ({
  title,
  icon: Icon,
  children,
  span = 1,
}) => (
  <div
    className={`
      min-w-0
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/[0.045]
      p-6
      backdrop-blur-xl
      text-white
      transition-all
      duration-300
      hover:border-[#d100a0]/40
      hover:bg-white/[0.06]
      hover:shadow-[0_0_35px_rgba(209,0,160,0.20)]
      ${
        span === 2
          ? 'lg:col-span-2'
          : ''
      }
    `}
  >
    {/* Header */}
    <div className="mb-6 flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div
          className="
            flex
            h-11
            w-11
            flex-shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-[#d100a0]
            to-purple-800
            shadow-[0_0_20px_rgba(209,0,160,0.35)]
          "
        >
          <Icon
            size={20}
            strokeWidth={2}
            className="text-white"
          />
        </div>

        <h3
          className="
            truncate
            text-lg
            font-bold
            tracking-tight
            text-white
          "
        >
          {title}
        </h3>
      </div>

      <TrendingUp
        size={19}
        className="flex-shrink-0 text-[#d100a0]"
      />
    </div>

    {children}
  </div>
);

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#d100a0]/40
        bg-[#0f0518]/95
        p-4
        shadow-[0_0_30px_rgba(209,0,160,0.25)]
        backdrop-blur-xl
      "
    >
      {label && (
        <p className="mb-3 text-sm font-bold text-white">
          {label}
        </p>
      )}

      {payload.map((entry, index) => (
        <div
          key={index}
          className="
            mb-1.5
            flex
            items-center
            gap-2
            text-xs
          "
        >
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: entry.color,
            }}
          />

          <span className="text-gray-400">
            {entry.name}:
          </span>

          <span className="font-bold text-white">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   ANALYTICS
========================================================= */

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =======================================================
     FETCH ANALYTICS
  ======================================================= */

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const res = await axios.get(
        '/admin/analytics',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(
        'Analytics fetch error:',
        err
      );

      setError(
        'Failed to load analytics data. Check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchAnalytics();
  }, []);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeInUp">

        <div
          className="
            flex
            min-h-[420px]
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-white/10
            bg-white/[0.045]
            p-10
            backdrop-blur-xl
          "
        >
          <LoaderIcon />

          <p
            className="
              mt-5
              animate-pulse
              text-sm
              font-medium
              text-gray-300
            "
          >
            Loading Analytics Data...
          </p>
        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-rose-500/20
            bg-white/[0.045]
            p-10
            text-center
            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-rose-500/20
              bg-rose-500/10
            "
          >
            <Activity
              size={25}
              className="text-rose-400"
            />
          </div>

          <p className="mb-5 font-bold text-rose-400">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-gradient-to-r
              from-[#d100a0]
              via-[#a21caf]
              to-[#6b21a8]
              px-6
              py-3
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-white
              shadow-[0_0_25px_rgba(209,0,160,0.4)]
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-[0_0_40px_rgba(209,0,160,0.7)]
              active:scale-95
            "
          >
            <RefreshCcw size={15} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     SAFE DATA
  ======================================================= */

  const {
    summary = {},
    boothStatusData = [],
    boothCategoryData = [],
    boothTrafficData = [],
    attendeeEngagementData = [],
    sessionPopularityData = [],
    registrationTrend = [],
    userRoleData = [],
    recentActivities = [],
  } = data || {};

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="w-full min-w-0 space-y-8 animate-fadeInUp">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-6
          rounded-3xl
          border
          border-white/10
          bg-white/[0.045]
          p-6
          text-white
          backdrop-blur-xl
          sm:p-8
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="min-w-0">

          <h2
            className="
              flex
              items-center
              gap-3
              text-2xl
              font-black
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            <Sparkles
              className="flex-shrink-0 text-[#d100a0]"
              size={27}
            />

            <span>
              Analytics Overview
            </span>
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Monitor exhibition performance, registrations,
            booth traffic, and user engagement.
          </p>

        </div>

        <button
          onClick={fetchAnalytics}
          className="
            group
            inline-flex
            w-full
            flex-shrink-0
            items-center
            justify-center
            gap-2.5
            rounded-full
            border
            border-white/20
            bg-gradient-to-r
            from-[#d100a0]
            via-[#a21caf]
            to-[#6b21a8]
            px-6
            py-3.5
            text-xs
            font-extrabold
            uppercase
            tracking-wider
            text-white
            shadow-[0_0_25px_rgba(209,0,160,0.5)]
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-[0_0_40px_rgba(209,0,160,0.8)]
            active:scale-95
            sm:w-auto
          "
        >
          <RefreshCcw
            size={17}
            className="
              transition-transform
              duration-500
              group-hover:rotate-180
            "
          />

          Refresh Analytics
        </button>
      </div>

      {/* =================================================
          SUMMARY STAT BOXES
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
          2xl:grid-cols-5
        "
      >
        <StatCard
          label="Total Expos"
          value={summary.totalExpos ?? 0}
          icon={Calendar}
          trend={12}
        />

        <StatCard
          label="Total Sessions"
          value={summary.totalSessions ?? 0}
          icon={Layers}
          trend={8}
        />

        <StatCard
          label="Total Attendees"
          value={summary.totalAttendees ?? 0}
          icon={Users}
          trend={23}
        />

        <StatCard
          label="Total Exhibitors"
          value={summary.totalExhibitors ?? 0}
          icon={BarChart3}
          trend={-5}
        />

        <StatCard
          label="Registrations"
          value={summary.totalBookings ?? 0}
          icon={TrendingUp}
          trend={18}
        />
      </div>

      {/* =================================================
          MAIN CHARTS
      ================================================= */}

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-6
          lg:grid-cols-2
        "
      >

        {/* BOOTH TRAFFIC */}

        <ChartCard
          title="Booth Traffic by Expo"
          icon={BarChart3}
        >
          <div className="h-[320px] w-full min-w-0">

            {boothTrafficData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={boothTrafficData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: 'rgba(209,0,160,0.08)',
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      color: '#cbd5e1',
                      fontSize: '11px',
                    }}
                  />

                  <Bar
                    dataKey="booked"
                    name="Booked"
                    fill="#d100a0"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />

                  <Bar
                    dataKey="available"
                    name="Available"
                    fill="#7210a6"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No Booth Traffic Data Available" />
            )}

          </div>
        </ChartCard>

        {/* REGISTRATION TREND */}

        <ChartCard
          title="Registration Trend"
          icon={TrendingUp}
        >
          <div className="h-[320px] w-full min-w-0">

            {registrationTrend.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={registrationTrend}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="registrationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#d100a0"
                        stopOpacity={0.5}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7210a6"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="registrations"
                    name="Registrations"
                    stroke="#d100a0"
                    strokeWidth={3}
                    fill="url(#registrationGradient)"
                    dot={{
                      fill: '#d100a0',
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                      fill: '#d100a0',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No Registration Data Available" />
            )}

          </div>
        </ChartCard>
      </div>

      {/* =================================================
          BOOTH STATUS + CATEGORY
      ================================================= */}

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-6
          lg:grid-cols-2
        "
      >

        {/* BOOTH STATUS */}

        <ChartCard
          title="Booth Status Overview"
          icon={PieChartIcon}
        >
          <div className="h-[320px] w-full min-w-0">

            {boothStatusData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={boothStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="44%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={5}
                    stroke="rgba(255,255,255,0.05)"
                  >
                    {boothStatusData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            BOOTH_STATUS_COLORS[
                              entry.name
                            ] ||
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{
                      color: '#cbd5e1',
                      fontSize: '11px',
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No Booth Status Data Available" />
            )}

          </div>
        </ChartCard>

        {/* CATEGORY */}

        <ChartCard
          title="Booth Categories"
          icon={Layers}
        >
          <div className="h-[320px] w-full min-w-0">

            {boothCategoryData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={boothCategoryData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={95}
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="value"
                    name="Booths"
                    fill="#d100a0"
                    radius={[0, 6, 6, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                message="No Category Data Available"
              />
            )}

          </div>
        </ChartCard>
      </div>

      {/* =================================================
          SESSION + ENGAGEMENT
      ================================================= */}

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-6
          lg:grid-cols-2
        "
      >

        {/* SESSION POPULARITY */}

        <ChartCard
          title="Session Popularity"
          icon={Activity}
        >
          <div className="h-[320px] w-full min-w-0">

            {sessionPopularityData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={sessionPopularityData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Bar
                    dataKey="value"
                    name="Attendance"
                    fill="#7210a6"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                message="No Session Data Available"
              />
            )}

          </div>
        </ChartCard>

        {/* ATTENDEE ENGAGEMENT */}

        <ChartCard
          title="Attendee Engagement"
          icon={Users}
        >
          <div className="h-[320px] w-full min-w-0">

            {attendeeEngagementData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={attendeeEngagementData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="engagementGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7210a6"
                        stopOpacity={0.5}
                      />

                      <stop
                        offset="100%"
                        stopColor="#d100a0"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: '#cbd5e1',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Engagement"
                    stroke="#7210a6"
                    strokeWidth={3}
                    fill="url(#engagementGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                message="No Engagement Data Available"
              />
            )}

          </div>
        </ChartCard>
      </div>

      {/* =================================================
          USER ROLES
      ================================================= */}

      {userRoleData.length > 0 && (
        <ChartCard
          title="User Role Distribution"
          icon={Users}
        >
          <div className="h-[320px] w-full min-w-0">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={userRoleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="44%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {userRoleData.map(
                    (entry, index) => (
                      <Cell
                        key={`role-${index}`}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                />

                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{
                    color: '#cbd5e1',
                    fontSize: '11px',
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </ChartCard>
      )}

      {/* =================================================
          RECENT ACTIVITIES
      ================================================= */}

      {recentActivities.length > 0 && (
        <div
          className="
            min-w-0
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.045]
            p-6
            text-white
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-[#d100a0]/40
            hover:shadow-[0_0_35px_rgba(209,0,160,0.20)]
            sm:p-8
          "
        >

          {/* Header */}

          <div className="mb-6 flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                flex-shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-[#d100a0]
                to-purple-800
                shadow-[0_0_20px_rgba(209,0,160,0.35)]
              "
            >
              <Clock
                size={20}
                className="text-white"
              />
            </div>

            <div className="min-w-0">

              <h3
                className="
                  text-lg
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Recent Activities
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Latest platform activity
              </p>

            </div>
          </div>

          {/* Activities */}

          <div className="space-y-3">

            {recentActivities
              .slice(0, 8)
              .map((activity, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.035]
                    p-4
                    transition-all
                    duration-300
                    hover:border-[#d100a0]/30
                    hover:bg-white/[0.07]
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[#d100a0]/20
                          bg-[#d100a0]/10
                        "
                      >
                        <Activity
                          size={15}
                          className="text-[#d100a0]"
                        />
                      </div>

                      <p
                        className="
                          min-w-0
                          text-sm
                          leading-5
                          text-gray-200
                        "
                      >
                        {activity.message ||
                          activity.title ||
                          'System activity'}
                      </p>

                    </div>

                    {activity.createdAt && (
                      <span
                        className="
                          whitespace-nowrap
                          text-[10px]
                          text-gray-500
                          sm:ml-auto
                        "
                      >
                        {new Date(
                          activity.createdAt
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>
                </div>
              ))}

          </div>
        </div>
      )}

    </div>
  );
};

/* =========================================================
   LOADER
========================================================= */

const LoaderIcon = () => (
  <div className="relative h-14 w-14">

    <div
      className="
        absolute
        inset-0
        rounded-full
        border-4
        border-white/10
      "
    />

    <div
      className="
        absolute
        inset-0
        animate-spin
        rounded-full
        border-4
        border-transparent
        border-r-[#7210a6]
        border-t-[#d100a0]
      "
    />

  </div>
);

/* =========================================================
   EMPTY CHART
========================================================= */

const EmptyChart = ({
  message,
}) => (
  <div
    className="
      flex
      h-full
      flex-col
      items-center
      justify-center
      text-gray-500
    "
  >
    <BarChart3
      size={38}
      className="
        mb-3
        text-[#d100a0]
        opacity-40
      "
    />

    <p className="text-xs font-medium">
      {message}
    </p>
  </div>
);

export default Analytics;