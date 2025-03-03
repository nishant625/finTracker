"use client"

import { cn } from "@/lib/utils"

import { TrendingDown, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const insights = [
  {
    id: "1",
    title: "Food spending is up 15% this month",
    description: "You've spent $75 more on food compared to your monthly average.",
    type: "warning",
    icon: TrendingUp,
    action: "Review food expenses",
  },
  {
    id: "2",
    title: "You're under budget in Transportation",
    description: "You've spent $120 less on transportation this month. Great job!",
    type: "success",
    icon: TrendingDown,
    action: "See transportation details",
  },
  {
    id: "3",
    title: "Unusual transaction detected",
    description: "We noticed a $250 transaction at Electronics Store that's outside your normal spending pattern.",
    type: "alert",
    icon: AlertCircle,
    action: "Review transaction",
  },
]

export function SpendingInsights() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {insights.map((insight) => (
        <Card
          key={insight.id}
          className={cn(
            "border-l-4",
            insight.type === "warning"
              ? "border-l-orange-500"
              : insight.type === "success"
                ? "border-l-green-500"
                : "border-l-blue-500",
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-0.5 rounded-full p-1.5",
                  insight.type === "warning"
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
                    : insight.type === "success"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                )}
              >
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
                <Button variant="link" className="h-auto p-0 text-xs" asChild>
                  <span>
                    {insight.action}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

