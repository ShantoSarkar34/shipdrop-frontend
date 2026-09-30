import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statuses = [
  { label: "Delivered", className: "bg-success-soft text-success-fg" },
  { label: "In transit", className: "bg-info-soft text-info-fg" },
  { label: "Pending", className: "bg-warning-soft text-warning-fg" },
  { label: "Failed", className: "bg-danger-soft text-danger-fg" },
];

const chartColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

export default function TokenPreviewPage() {
  return (
    <div className="bg-hero-glow">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 pb-16">
        <h1 className="text-3xl font-extrabold">Design tokens preview</h1>
        <p className="text-muted-foreground">Temporary page. It will be replaced by the real homepage.</p>

        <Card>
          <CardHeader>
            <CardTitle>Buttons and form field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="max-w-sm space-y-2">
              <Label htmlFor="tracking">Tracking ID</Label>
              <Input id="tracking" placeholder="SD2609..." className="font-mono" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status colors and chart palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <span key={s.label} className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}>
                  {s.label}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {chartColors.map((c) => (
                <span key={c} className={`size-10 rounded-md ${c}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}