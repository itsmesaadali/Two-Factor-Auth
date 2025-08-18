import React from "react";
import { Loader, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseUserAgent } from "../../../lib/parse-useragent";

const SessionItem = (props: {
  loading?: boolean;
  userAgent: string;
  date: string;
  isCurrent?: boolean;
  expiredAt: string;
  onRemove?: () => void;
}) => {
  const { userAgent, loading, date, isCurrent = false, onRemove } = props;

  const { browser, icon: Icon, os, timeAgo } = parseUserAgent(
    userAgent,
    date
  );

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="w-full flex items-center">
      <div className="shrink-0 mr-4 flex items-center justify-center w-12 h-12 rounded-full border border-[#eee] dark:border-[rgb(42,45,48)]">
        <Icon />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <h5 className="text-sm font-medium leading-5">{os} / {browser}</h5>
          <div className="mt-1">
            {isCurrent ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-green-500/80 text-white">
                Active now
              </span>
            ) : (
              <span className="text-[13px] text-muted-foreground font-normal">
                {timeAgo}
              </span>
            )}
          </div>
        </div>

        {!isCurrent && (
          <Button
            onClick={handleRemove}
            disabled={loading}
            variant="ghost"
            size="icon"
          >
            {loading ? <Loader className="animate-spin" /> : <Trash2 size={20} />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionItem;
