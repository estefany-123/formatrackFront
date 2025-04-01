import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import React from "react";

type TabItem = {
  key: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
};

export default function Tap({ tabs }: Props) {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        {tabs.map(({ key, title, content }) => (
          <Tab key={key} title={title}>
            <Card>
              <CardBody>{content}</CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
