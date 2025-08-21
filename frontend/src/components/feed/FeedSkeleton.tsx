import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const FeedSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Post Input Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Post Skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-slate-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 bg-slate-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              
              <div className="pt-3 border-t border-slate-200">
                <div className="flex space-x-2">
                  <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-slate-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedSkeleton;
