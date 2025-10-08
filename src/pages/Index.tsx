import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AnalysisResults from "@/components/AnalysisResults";

const Index = () => {
  const [tweetInput, setTweetInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!tweetInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a tweet URL or text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis - will be replaced with real API call
    setTimeout(() => {
      const mockResults = {
        originalTweet: {
          text: tweetInput.includes("http") ? "This is a sample tweet text extracted from the URL" : tweetInput,
          author: "@sampleuser",
          date: new Date().toISOString(),
        },
        duplicates: {
          total: 47,
          botLikely: 32,
          possiblyAutomated: 8,
          likelyHuman: 7,
        },
        accounts: [
          { username: "bot_account_1", handle: "@botacct1", followers: 120, following: 5000, createdAt: "2024-01-15", verified: false, botScore: 0.92, classification: "Likely Bot" },
          { username: "suspicious_user", handle: "@sususer", followers: 450, following: 4200, createdAt: "2024-02-20", verified: false, botScore: 0.71, classification: "Possibly Automated" },
          { username: "real_person", handle: "@realperson", followers: 2300, following: 850, createdAt: "2019-05-10", verified: true, botScore: 0.15, classification: "Likely Human" },
          { username: "bot_network_2", handle: "@botnet2", followers: 89, following: 5200, createdAt: "2024-03-01", verified: false, botScore: 0.88, classification: "Likely Bot" },
          { username: "another_bot", handle: "@anotherbot", followers: 200, following: 4800, createdAt: "2024-01-28", verified: false, botScore: 0.95, classification: "Likely Bot" },
        ],
      };
      setResults(mockResults);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: `Found ${mockResults.duplicates.total} duplicate tweets`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TweetTrace
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!results ? (
          // Landing View
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 py-12">
              <h2 className="text-5xl font-bold tracking-tight">
                Detect Bot-Driven
                <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Tweet Campaigns
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Paste any tweet URL or text. We'll find all duplicates and use AI to estimate how many were posted by bots.
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle>Analyze a Tweet</CardTitle>
                <CardDescription>
                  Enter a tweet URL (e.g., twitter.com/user/status/123...) or paste the tweet text directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste tweet URL or text..."
                    value={tweetInput}
                    onChange={(e) => setTweetInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-[var(--shadow-glow)] transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-pulse">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-primary mb-1">1</div>
                      <p className="text-sm text-muted-foreground">Paste tweet URL or text</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-primary mb-1">2</div>
                      <p className="text-sm text-muted-foreground">AI searches for duplicates</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-primary mb-1">3</div>
                      <p className="text-sm text-muted-foreground">View bot detection results</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Results View
          <AnalysisResults results={results} onNewSearch={() => { setResults(null); setTweetInput(""); }} />
        )}
      </main>
    </div>
  );
};

export default Index;
