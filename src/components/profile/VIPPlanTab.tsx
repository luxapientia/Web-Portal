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
import toast from "react-hot-toast";
import { InterestMatrix } from "@/models/InterestMatrix";

export default function VIPPlanTab() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [plans, setPlans] = useState<InterestMatrix[]>([]);
  const [currentPlan, setCurrentPlan] = useState<InterestMatrix | null>(null);
  const [nextPlan, setNextPlan] = useState<InterestMatrix | null>(null);
  const [activeMembers, setActiveMembers] = useState(0);
  const theme = useTheme();
  
  useEffect(() => {
    fetchVIPPlans();
  }, []);
  
  useEffect(() => {
    fetchAccountValue();
  }, [plans]);

  const fetchAccountValue = async () => {
    try {
      const response = await fetch('/api/account-asset');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch account value');
      }

      setBalance(data.accountValue);
      setCurrentPlan(data.vipLevel);
      const nextLevel = data.vipLevel.level + 1;
      const nextPlan = plans.find(plan => plan.level === nextLevel) || null;
      setNextPlan(nextPlan);
    } catch {
      toast.error('Failed to fetch account value');
    }
  };

  const fetchVIPPlans = async () => {
    setLoading(true);
    const response = await fetch("/api/interest-matrix", {
      method: "GET",
    });
    if (response) {
      const interestMatrix = await response.json();
      if (interestMatrix.success && interestMatrix.data) {
        setPlans(interestMatrix.data);
        // const userBalance = balance || 0;
        // const sortedInterestMatrix = [...interestMatrix.data].sort(
        //   (a, b) => a.startAccountValue - b.startAccountValue
        // );
        // let current = null;
        // let next = null;
        // for (let i = 0; i < sortedInterestMatrix.length; i++) {
        //   const plan = sortedInterestMatrix[i];
        //   if (
        //     userBalance >= plan.startAccountValue &&
        //     userBalance <= plan.endAccountValue
        //   ) {
        //     current = plan;
        //     next = sortedInterestMatrix[i + 1] || null;
        //     break;
        //   }
        // }
        // if (!current && sortedInterestMatrix.length > 0) {
        //   next = sortedInterestMatrix[0];
        // }
        // setCurrentPlan(current);
        // setNextPlan(next);
      }
    }
    setActiveMembers(8); // Example value
    setLoading(false);
  };

  const calculateProgress = () => {
    if (!currentPlan || !nextPlan) return 0;

    const currentMin = currentPlan.startAccountValue;
    const nextMin = nextPlan.startAccountValue;
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
              label={currentPlan ? currentPlan.name : "No VIP Level Yet"}
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
                  ${balance.toFixed(8)} USD
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
                  {currentPlan ? currentPlan.name : "No VIP"}
                </Typography>
                <Typography variant="body2">{nextPlan.name}</Typography>
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
                  ${currentPlan ? currentPlan.startAccountValue : 0} USD
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${nextPlan.startAccountValue} USD
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                You need $
                {Math.max(
                  nextPlan.startAccountValue - balance,
                  0
                ).toFixed(8)}{" "}
                USD more to reach {nextPlan.name}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Current VIP Benefits */}
      {currentPlan && (
        <Card sx={{ boxShadow: 1 }}>
          <CardHeader
            title={`${currentPlan.name} Benefits`}
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
                  secondary={`${currentPlan.dailyTasksRewardPercentage}% daily interest on your balance`}
                />
              </ListItem>
              <Divider component="li" />

              <ListItem>
                <ListItemIcon>
                  <MonetizationOn color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Referral Rewards"
                  secondary={`$${currentPlan.uplineDepositReward.toFixed(
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
                  secondary={`$${currentPlan.promotionReward.toFixed(
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
                  secondary={`${currentPlan.dailyTasksCountAllowed
                    } tasks allowed daily, earning $${currentPlan.dailyTasksRewardPercentage.toFixed(
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
                      {plan.name}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    ${plan.startAccountValue} - $
                    {plan.endAccountValue} USD
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
                        {plan.dailyTasksRewardPercentage}% Daily Interest
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        ${plan.uplineDepositReward.toFixed(8)} Per
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
                        {plan.dailyTasksCountAllowed} Daily Tasks
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircle
                        color="primary"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        Min. {plan.startActiveMembers} Team Members
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
