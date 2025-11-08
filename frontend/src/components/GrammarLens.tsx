interface GrammarLensProps {
  grammar: {
    title: string;
    description: string;
    examples: Array<{
      [key: string]: string;
      translation: string;
    }>;
    difficulty?: string;
    tags?: string[];
    relatedClips?: Array<any>;
  };
}

export function GrammarLens({ grammar }: GrammarLensProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card p-8 rounded-lg border mb-8">
        <h1 className="text-3xl font-bold mb-4">{grammar.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{grammar.description}</p>
        
        {grammar.difficulty && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{grammar.difficulty}</span>
        )}
      </div>

      {/* 示例 */}
      <div className="bg-card p-8 rounded-lg border mb-8">
        <h2 className="text-2xl font-bold mb-4">示例</h2>
        <div className="space-y-4">
          {grammar.examples?.map((example, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              {Object.entries(example).map(([key, value]) => {
                if (key === 'translation') {
                  return (
                    <p key={key} className="text-muted-foreground mt-2">
                      {value}
                    </p>
                  );
                }
                return (
                  <p key={key} className="font-medium">
                    {value}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 相关片段 */}
      {grammar.relatedClips && grammar.relatedClips.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">相关片段</h2>
          <div className="space-y-4">
            {grammar.relatedClips.map((clip) => (
              <div key={clip.id} className="p-4 border rounded-lg">
                <p className="text-lg">{clip.originalSubtitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
