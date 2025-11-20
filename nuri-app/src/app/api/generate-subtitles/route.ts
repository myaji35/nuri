import { NextRequest, NextResponse } from 'next/server';

// Gemini API 호출
async function callGeminiAPI(apiKey: string, title: string, description: string, count: number): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `당신은 농업법인 누리팜의 뉴스 기사 서브제목을 생성하는 전문가입니다.

다음 뉴스 기사의 서브제목을 ${count}개 생성해주세요.

제목: ${title}
설명: ${description}

요구사항:
- 각 서브제목은 간결하고 핵심을 담아야 합니다
- 서로 다른 관점이나 측면을 다뤄야 합니다
- 농업, 스마트팜, 사회공헌 등 누리팜의 가치와 연결되어야 합니다
- JSON 배열 형태로만 응답해주세요

응답 형식 예시: ["서브제목1", "서브제목2", "서브제목3"]`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API 오류: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Gemini API에서 응답을 받지 못했습니다.');
  }

  return content;
}

// OpenAI API 호출
async function callOpenAIAPI(apiKey: string, title: string, description: string, count: number): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 농업법인 누리팜의 뉴스 기사 서브제목을 생성하는 전문가입니다. 농업, 스마트팜, 사회공헌 등의 가치를 담은 서브제목을 만들어주세요.'
        },
        {
          role: 'user',
          content: `다음 뉴스 기사의 서브제목을 ${count}개 생성해주세요.\n\n제목: ${title}\n설명: ${description}\n\n각 서브제목은 간결하고 핵심을 담아야 하며, 서로 다른 관점이나 측면을 다뤄야 합니다. JSON 배열 형태로만 응답해주세요. 예: ["서브제목1", "서브제목2", "서브제목3"]`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API 오류: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI API에서 응답을 받지 못했습니다.');
  }

  return content;
}

// Claude API 호출
async function callClaudeAPI(apiKey: string, title: string, description: string, count: number): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `당신은 농업법인 누리팜의 뉴스 기사 서브제목을 생성하는 전문가입니다.

다음 뉴스 기사의 서브제목을 ${count}개 생성해주세요.

제목: ${title}
설명: ${description}

요구사항:
- 각 서브제목은 간결하고 핵심을 담아야 합니다
- 서로 다른 관점이나 측면을 다뤄야 합니다
- 농업, 스마트팜, 사회공헌 등 누리팜의 가치와 연결되어야 합니다
- JSON 배열 형태로만 응답해주세요

응답 형식 예시: ["서브제목1", "서브제목2", "서브제목3"]`
        }
      ]
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API 오류: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error('Claude API에서 응답을 받지 못했습니다.');
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, count, organizationId = 1, llmProvider, apiKey: clientApiKey } = await request.json();

    // 회원사 설정에서 LLM Provider와 API Key 가져오기
    const provider = llmProvider || 'gemini';
    let apiKey = clientApiKey;

    // API Key가 전달되지 않은 경우 환경 변수에서 가져오기
    if (!apiKey) {
      if (provider === 'gemini') {
        apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      } else if (provider === 'openai') {
        apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      } else if (provider === 'claude') {
        apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: `${provider.toUpperCase()} API 키가 설정되지 않았습니다. 기본정보에서 API 키를 설정해주세요.` },
        { status: 500 }
      );
    }

    // LLM Provider별 API 호출
    let content: string;

    if (provider === 'gemini') {
      content = await callGeminiAPI(apiKey, title, description, count);
    } else if (provider === 'openai') {
      content = await callOpenAIAPI(apiKey, title, description, count);
    } else if (provider === 'claude') {
      content = await callClaudeAPI(apiKey, title, description, count);
    } else {
      return NextResponse.json(
        { error: '지원하지 않는 LLM Provider입니다.' },
        { status: 400 }
      );
    }

    // JSON 배열 파싱
    try {
      // JSON 코드 블록 제거 (```json ... ``` 형태)
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const subtitles = JSON.parse(cleanContent);

      if (!Array.isArray(subtitles)) {
        throw new Error('응답이 배열이 아닙니다.');
      }

      return NextResponse.json({ subtitles: subtitles.slice(0, count) });
    } catch (parseError) {
      // JSON 파싱 실패 시, 줄바꿈으로 분리 시도
      const lines = content
        .split('\n')
        .filter((line: string) => line.trim() && !line.includes('```'))
        .map((line: string) => line.replace(/^[-*\d.]\s*/, '').replace(/^["']|["']$/g, '').trim())
        .filter((line: string) => line.length > 0);

      const subtitles = lines.slice(0, count);

      return NextResponse.json({ subtitles });
    }

  } catch (error) {
    console.error('서브제목 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
