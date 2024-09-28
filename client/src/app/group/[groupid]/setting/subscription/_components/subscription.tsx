"use client";

import { useAllSubscriptions } from "@/hooks/payment";
import { SubscriptionCard } from "./card";

type SubscriptionsProps = {
  groupid: string;
};

export const Subscriptions = ({ groupid }: SubscriptionsProps) => {
  const { data, mutate } = useAllSubscriptions(groupid);

  return data?.data === 200 && data?.data?.subscriptions ? (
    data?.data?.subscriptions.map((subscription: any) => (
      <SubscriptionCard
        active={subscription.active}
        onClick={() => mutate({ id: subscription.id })}
        key={subscription.id}
        price={`${subscription.price}`}
        members={`${data?.data?.count}`}
      />
    ))
  ) : (
    <></>
  );
};
