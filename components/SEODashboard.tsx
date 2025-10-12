'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Clock, 
  MousePointer, 
  Target,
  Search,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react'

interface SEOMetrics {
  intentSatisfactionScore: number
  averageTimeOnPage: number
  scrollDepth: number
  engagementScore: number
  taskCompletionRate: number
  bounceRate: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
  searchVisibility: number
  organicTraffic: number
  keywordRankings: {
    keyword: string
    position: number
    change: number
  }[]
}

interface PagePerformance {
  page: string
  pageType: string
  iss: number
  traffic: number
  conversions: number
  trend: 'up' | 'down' | 'stable'
}

export default function SEODashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [topPages, setTopPages] = useState<PagePerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')

  useEffect(() => {
    fetchSEOMetrics()
  }, [timeframe])

  const fetchSEOMetrics = async () => {
    try {
      setLoading(true)
      
      // Fetch Intent Satisfaction metrics
      const response = await fetch(`/api/intent-metrics?timeframe=${timeframe}`)
      const data = await response.json()
      
      // Mock comprehensive SEO data (in production, fetch from your analytics)
      const mockMetrics: SEOMetrics = {
        intentSatisfactionScore: data.averageIntentSatisfactionScore || 78.5,
        averageTimeOnPage: data.averageTimeOnPage || 145,
        scrollDepth: data.averageScrollDepth || 67,
        engagementScore: 82.3,
        taskCompletionRate: data.taskCompletionRate || 0.73,
        bounceRate: 34.2,
        coreWebVitals: {
          lcp: 1.8,
          fid: 85,
          cls: 0.08
        },
        searchVisibility: 89.4,
        organicTraffic: 15420,
        keywordRankings: [
          { keyword: 'ai tools 2025', position: 3, change: 2 },
          { keyword: 'best ai tools', position: 5, change: -1 },
          { keyword: 'ai software directory', position: 8, change: 3 },
          { keyword: 'artificial intelligence tools', position: 12, change: 0 },
          { keyword: 'free ai tools', position: 7, change: 1 }
        ]
      }

      const mockTopPages: PagePerformance[] = [
        { page: '/ai-tools/chatgpt', pageType: 'tool-page', iss: 89.2, traffic: 2340, conversions: 156, trend: 'up' },
        { page: '/ai-tools/midjourney', pageType: 'tool-page', iss: 86.7, traffic: 1890, conversions: 134, trend: 'up' },
        { page: '/', pageType: 'homepage', iss: 84.3, traffic: 3420, conversions: 89, trend: 'stable' },
        { page: '/ai-tools/claude', pageType: 'tool-page', iss: 82.1, traffic: 1560, conversions: 98, trend: 'down' },
        { page: '/blog/best-ai-tools-2025', pageType: 'blog-post', iss: 79.8, traffic: 1230, conversions: 67, trend: 'up' }
      ]

      setMetrics(mockMetrics)
      setTopPages(mockTopPages)
    } catch (error) {
      console.error('Error fetching SEO metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SEO Performance Dashboard</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === period 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intent Satisfaction Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.intentSatisfactionScore)}`}>
              {metrics.intentSatisfactionScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              2025 Algorithm Compliance
            </p>
            <Progress value={metrics.intentSatisfactionScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(metrics.averageTimeOnPage / 60)}m {metrics.averageTimeOnPage % 60}s
            </div>
            <p className="text-xs text-muted-foreground">
              Engagement Quality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.taskCompletionRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              User Intent Fulfillment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.organicTraffic.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly Visitors
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User behavior and satisfaction indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Scroll Depth</span>
                  <span className="font-semibold">{metrics.scrollDepth}%</span>
                </div>
                <Progress value={metrics.scrollDepth} />
                
                <div className="flex justify-between items-center">
                  <span>Engagement Score</span>
                  <span className="font-semibold">{metrics.engagementScore}%</span>
                </div>
                <Progress value={metrics.engagementScore} />
                
                <div className="flex justify-between items-center">
                  <span>Bounce Rate</span>
                  <span className="font-semibold">{metrics.bounceRate}%</span>
                </div>
                <Progress value={100 - metrics.bounceRate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Visibility</CardTitle>
                <CardDescription>Overall search engine performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {metrics.searchVisibility}%
                </div>
                <Progress value={metrics.searchVisibility} />
                <p className="text-sm text-muted-foreground mt-2">
                  Excellent visibility across target keywords
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Current positions for target keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.keywordRankings.map((ranking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{ranking.keyword}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Position {ranking.position}</Badge>
                        {ranking.change !== 0 && (
                          <Badge className={ranking.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {ranking.change > 0 ? '+' : ''}{ranking.change}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {ranking.change > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : ranking.change < 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  LCP
                </CardTitle>
                <CardDescription>Largest Contentful Paint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metrics.coreWebVitals.lcp <= 2.5 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {metrics.coreWebVitals.lcp}s
                </div>
                <Badge className={metrics.coreWebVitals.lcp <= 2.5 ? getScoreBadge(90) : getScoreBadge(70)}>
                  {metrics.coreWebVitals.lcp <= 2.5 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  FID
                </CardTitle>
                <CardDescription>First Input Delay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metrics.coreWebVitals.fid <= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {metrics.coreWebVitals.fid}ms
                </div>
                <Badge className={metrics.coreWebVitals.fid <= 100 ? getScoreBadge(90) : getScoreBadge(70)}>
                  {metrics.coreWebVitals.fid <= 100 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  CLS
                </CardTitle>
                <CardDescription>Cumulative Layout Shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${metrics.coreWebVitals.cls <= 0.1 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {metrics.coreWebVitals.cls}
                </div>
                <Badge className={metrics.coreWebVitals.cls <= 0.1 ? getScoreBadge(90) : getScoreBadge(70)}>
                  {metrics.coreWebVitals.cls <= 0.1 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>Pages ranked by Intent Satisfaction Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{page.page}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{page.pageType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {page.traffic.toLocaleString()} visitors
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {page.conversions} conversions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(page.iss)}`}>
                          {page.iss}%
                        </div>
                        <div className="text-xs text-muted-foreground">ISS</div>
                      </div>
                      {getTrendIcon(page.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}