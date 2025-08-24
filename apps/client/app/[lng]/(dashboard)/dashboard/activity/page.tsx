import { Card, CardContent, CardHeader, CardTitle } from "@saas/ui";
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { ActivityType } from "@/lib/db/schema";
import { getActivityLogs } from "@/lib/db/queries";
import { useTranslation } from "@/app/i18n/useTranslation";

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
};

function getRelativeTime(date: Date, t: any) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return t("just_now");
  if (diffInSeconds < 3600)
    return t("minutes_ago", { count: Math.floor(diffInSeconds / 60) });
  if (diffInSeconds < 86400)
    return t("hours_ago", { count: Math.floor(diffInSeconds / 3600) });
  if (diffInSeconds < 604800)
    return t("days_ago", { count: Math.floor(diffInSeconds / 86400) });
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return "sign_up";
    case ActivityType.SIGN_IN:
      return "sign_in";
    case ActivityType.SIGN_OUT:
      return "sign_out";
    case ActivityType.UPDATE_PASSWORD:
      return "update_password";
    case ActivityType.DELETE_ACCOUNT:
      return "delete_account";
    case ActivityType.UPDATE_ACCOUNT:
      return "update_account";
    case ActivityType.CREATE_TEAM:
      return "create_team";
    case ActivityType.REMOVE_TEAM_MEMBER:
      return "remove_team_member";
    case ActivityType.INVITE_TEAM_MEMBER:
      return "invite_team_member";
    case ActivityType.ACCEPT_INVITATION:
      return "accept_invitation";
    default:
      return "unknown";
  }
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await useTranslation(lng, "activity");
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        {t("title")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {t(formattedAction)}
                        {log.ipAddress && ` ${t("from_ip")} ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(new Date(log.timestamp), t)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("no_activity")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("when_you_perform_actions")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
