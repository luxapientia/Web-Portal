import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  StarRate,
  TrendingUp,
  People,
  MonetizationOn,
  Assignment,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import toast from "react-hot-toast";
import { PlanWithoutId as Plan } from "@/models/Plan";

export default function VIPPlanTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [nextPlan, setNextPlan] = useState<Plan | null>(null);
  const [activeMembers, setActiveMembers] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  useEffect(() => {
    fetchVIPPlans();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const balanceResponse = await fetchWithAuth("/api/wallet/balance", {
        method: "GET",
        requireAuth: true,
      });

      if (balanceResponse) {
        const balanceData = await balanceResponse.json();
        if (balanceData.success) {
          setBalance(balanceData.balance || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching VIP plan data:", error);
      toast.error("Failed to load VIP plan information");
    } finally {
      setLoading(false);
    }
  };

  const fetchVIPPlans = async () => {
    setLoading(true);
    const plansResponse = await fetchWithAuth("/api/plans", {
      method: "GET",
      requireAuth: true,
    });
    if (plansResponse) {
      const plansData = await plansResponse.json();
      if (plansData.success && plansData.plans) {
        setPlans(plansData.plans);
        const userBalance = balance || 0;
        const sortedPlans = [...plansData.plans].sort(
          (a, b) => a.account_value_start_usd - b.account_value_start_usd
        );
        let current = null;
        let next = null;
        for (let i = 0; i < sortedPlans.length; i++) {
          const plan = sortedPlans[i];
          if (
            userBalance >= plan.account_value_start_usd &&
            userBalance <= plan.account_value_end_usd
          ) {
            current = plan;
            next = sortedPlans[i + 1] || null;
            break;
          }
        }
        if (!current && sortedPlans.length > 0) {
          next = sortedPlans[0];
        }
        setCurrentPlan(current);
        setNextPlan(next);
      }
    }
    setActiveMembers(8); // Example value
    setLoading(false);
  };

  const calculateProgress = () => {
    if (!currentPlan || !nextPlan) return 0;

    const currentMin = currentPlan.account_value_start_usd;
    const nextMin = nextPlan.account_value_start_usd;
    const range = nextMin - currentMin;

    if (range <= 0) return 100;

    const progress = ((balance - currentMin) / range) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading VIP plan information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Current VIP Status */}
      <Card sx={{ boxShadow: 1 }}>
        <CardHeader
          title="Your VIP Status"
          titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
        />
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Chip
              icon={<StarRate />}
              label={currentPlan ? currentPlan.plan_name : "No VIP Level Yet"}
              color="primary"
              sx={{
                fontSize: "1.2rem",
                py: 2.5,
                px: 2,
                "& .MuiChip-icon": { fontSize: "1.8rem" },
              }}
            />
          </Box>

          {/* Status Summary */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Current Balance
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  ${balance.toFixed(2)} USD
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Active Team Members
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {activeMembers} Members
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Progress Bar */}
          {nextPlan && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  {currentPlan ? currentPlan.plan_name : "No VIP"}
                </Typography>
                <Typography variant="body2">{nextPlan.plan_name}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  ${currentPlan ? currentPlan.account_value_start_usd : 0} USD
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${nextPlan.account_value_start_usd} USD
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                You need $
                {Math.max(
                  nextPlan.account_value_start_usd - balance,
                  0
                ).toFixed(2)}{" "}
                USD more to reach {nextPlan.plan_name}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Current VIP Benefits */}
      {currentPlan && (
        <Card sx={{ boxShadow: 1 }}>
          <CardHeader
            title={`${currentPlan.plan_name} Benefits`}
            titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Daily Interest Rate"
                  secondary={`${currentPlan.interest_daily_percent}% daily interest on your balance`}
                />
              </ListItem>
              <Divider component="li" />

              <ListItem>
                <ListItemIcon>
                  <MonetizationOn color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Referral Rewards"
                  secondary={`$${currentPlan.reward_per_user_deposit_usd.toFixed(
                    2
                  )} USD for each user deposit you refer`}
                />
              </ListItem>
              <Divider component="li" />

              <ListItem>
                <ListItemIcon>
                  <People color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Team Earnings"
                  secondary={`$${currentPlan.interest_from_each_direct_active_user_usd.toFixed(
                    3
                  )} USD from each direct active team member`}
                />
              </ListItem>
              <Divider component="li" />

              <ListItem>
                <ListItemIcon>
                  <Assignment color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Daily Tasks"
                  secondary={`${
                    currentPlan.daily_tasks_count_allowed
                  } tasks allowed daily, earning $${currentPlan.daily_tasks_reward_usd.toFixed(
                    2
                  )} USD per task`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}

      {/* All VIP Levels Overview */}
      <Card sx={{ boxShadow: 1 }}>
        <CardHeader
          title="VIP Levels Overview"
          titleTypographyProps={{ variant: "h6", fontWeight: 500 }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "flex-start",
            }}
          >
            {plans.map((plan, index) => (
              <Box
                key={index}
                sx={{
                  flex: "1 1 300px",
                  maxWidth: "100%",
                }}
              >
                <Paper
                  // elevation={
                  //   currentPlan && currentPlan._id === plan._id ? 3 : 1
                  // }
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {plan.plan_name}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    ${plan.account_value_start_usd} - $
                    {plan.account_value_end_usd} USD
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {plan.interest_daily_percent}% Daily Interest
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        ${plan.reward_per_user_deposit_usd.toFixed(2)} Per
                        Referral
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {plan.daily_tasks_count_allowed} Daily Tasks
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        Min. {plan.active_members_above} Team Members
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
