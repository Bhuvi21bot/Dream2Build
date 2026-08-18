import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";

import {
  Home,
  Products,
  Pricing,
  Community,
  Marketplace,
  About,
  Login,
} from "@/pages/index";

import { lazy, Suspense } from "react";

import {
  SmartWizard,
  ImportPlan,
  Templates,
  HireDesigner,
} from "@/pages/entry-pages";

import {
  AIFloorPlannerPage,
  InteriorAIPage,
  ClimateEnergyPage,
  LiveCostEstimatorPage,
  MaterialBOQPage,
} from "@/pages/ai-tools";

import { DesignGitRepo } from "@/pages/design-git-repo";
import { DesignWorkspace } from "@/pages/design-workspace";

const Planner = lazy(() => import("@/pages/planner"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>

      {/* =========================
          LOGIN
      ========================= */}
      <Route path="/login" component={Login} />

      {/* =========================
          PLANNER
          Fullscreen
      ========================= */}
      <Route path="/planner">
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
              Loading Planner...
            </div>
          }
        >
          <Planner />
        </Suspense>
      </Route>

      {/* =========================
          ALL OTHER ROUTES
      ========================= */}
      <Route>
        <Layout>
          <Switch>

            {/* HOME */}
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />

            {/* MAIN PAGES */}
            <Route path="/products" component={Products} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/community" component={Community} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/about" component={About} />

            {/* ENTRY POINTS */}
            <Route path="/wizard" component={SmartWizard} />
            <Route path="/import" component={ImportPlan} />
            <Route path="/templates" component={Templates} />
            <Route path="/designers" component={HireDesigner} />

            {/* AI TOOLS */}
            <Route path="/ai-floor-planner" component={AIFloorPlannerPage} />
            <Route path="/floor-planner" component={AIFloorPlannerPage} />
            <Route path="/interior-ai" component={InteriorAIPage} />
            <Route path="/climate-energy" component={ClimateEnergyPage} />
            <Route path="/cost-estimator" component={LiveCostEstimatorPage} />
            <Route path="/boq" component={MaterialBOQPage} />

            {/* DESIGN REPOSITORY */}
            <Route path="/repo" component={DesignGitRepo} />
            <Route path="/marketplace/repo" component={DesignGitRepo} />

            {/* DESIGN WORKSPACE */}
            <Route path="/design/:category">
              {(params) => (
                <DesignWorkspace category={params.category} />
              )}
            </Route>

            {/* 404 */}
            <Route component={NotFound} />

          </Switch>
        </Layout>
      </Route>

    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="dream2build-theme"
      >
        <TooltipProvider>

          <WouterRouter
            base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          >
            <Router />
          </WouterRouter>

          <Toaster />

        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;