import { ArrowLeft, Download, Bot, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AnalysisResultsProps {
  results: {
    originalTweet: {
      text: string;
      author: string;
      date: string;
    };
    duplicates: {
      total: number;
      botLikely: number;
      possiblyAutomated: number;
      likelyHuman: number;
    };
    accounts: Array<{
      username: string;
      handle: string;
      followers: number;
      following: number;
      createdAt: string;
      verified: boolean;
      botScore: number;
      classification: string;
    }>;
  };
  onNewSearch: () => void;
}

const AnalysisResults = ({ results, onNewSearch }: AnalysisResultsProps) => {
  const botPercentage = Math.round((results.duplicates.botLikely / results.duplicates.total) * 100);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Likely Bot":
        return "bg-destructive text-destructive-foreground";
      case "Possibly Automated":
        return "bg-warning text-warning-foreground";
      case "Likely Human":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Likely Bot":
        return <Bot className="h-4 w-4" />;
      case "Possibly Automated":
        return <AlertTriangle className="h-4 w-4" />;
      case "Likely Human":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onNewSearch}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Search
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Original Tweet */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Original Tweet</CardTitle>
          <CardDescription>{results.originalTweet.author} • {new Date(results.originalTweet.date).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{results.originalTweet.text}</p>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border bg-gradient-to-br from-card to-secondary/30">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-primary mb-2">{results.duplicates.total}</div>
            <p className="text-sm text-muted-foreground">Total Duplicates</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-gradient-to-br from-destructive/10 to-destructive/5">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-destructive mb-2">{results.duplicates.botLikely}</div>
            <p className="text-sm text-muted-foreground">Likely Bots</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-warning mb-2">{results.duplicates.possiblyAutomated}</div>
            <p className="text-sm text-muted-foreground">Possibly Automated</p>
          </CardContent>
        </Card>
        <Card className="border-success/50 bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-success mb-2">{results.duplicates.likelyHuman}</div>
            <p className="text-sm text-muted-foreground">Likely Human</p>
          </CardContent>
        </Card>
      </div>

      {/* Bot Percentage Alert */}
      <Card className={botPercentage > 60 ? "border-destructive/50 bg-destructive/5" : "border-border"}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center">
                <span className="text-2xl font-bold text-destructive-foreground">{botPercentage}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Bot Activity Level: {botPercentage > 60 ? "High" : botPercentage > 30 ? "Medium" : "Low"}</h3>
              <p className="text-sm text-muted-foreground">
                {botPercentage > 60 
                  ? "This tweet appears to be amplified by a significant bot network"
                  : botPercentage > 30
                  ? "Moderate bot activity detected in the duplicate tweets"
                  : "Low bot activity - most duplicates appear to be from human accounts"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Duplicate Tweet Analysis</CardTitle>
          <CardDescription>Accounts that posted identical or nearly identical tweets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Following</TableHead>
                <TableHead>Account Age</TableHead>
                <TableHead>Bot Score</TableHead>
                <TableHead>Classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.username}</div>
                      <div className="text-sm text-muted-foreground">{account.handle}</div>
                    </div>
                  </TableCell>
                  <TableCell>{account.followers.toLocaleString()}</TableCell>
                  <TableCell>{account.following.toLocaleString()}</TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            account.botScore > 0.7 ? "bg-destructive" : 
                            account.botScore > 0.4 ? "bg-warning" : 
                            "bg-success"
                          }`}
                          style={{ width: `${account.botScore * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{Math.round(account.botScore * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getClassificationColor(account.classification)}>
                      <span className="flex items-center gap-1">
                        {getClassificationIcon(account.classification)}
                        {account.classification}
                      </span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
