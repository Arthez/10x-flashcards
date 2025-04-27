/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FlashcardProposalDTO } from "@/types";
import { OPENROUTER_API_KEY } from "astro:env/server";
import { logger } from "../../lib/logger";

// Types for model parameters and responses
interface ModelParameters {
  temperature: number;
  max_tokens: number;
  top_p?: number;
}

interface FlashcardProposal {
  front_content: string;
  back_content: string;
}

interface FlashcardResponse {
  flashcards: FlashcardProposal[];
}

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
  modelName: string;
  defaultParameters?: Partial<ModelParameters>;
}

interface OpenRouterResponseFormat {
  type: string;
  json_schema: {
    name: string;
    schema: Record<string, any>;
  };
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterPayload {
  model: string;
  messages: ChatMessage[];
  response_format?: {
    type: string;
    json_schema: {
      name: string;
      schema: Record<string, any>;
    };
  };
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

/**
 * Service for interacting with OpenRouter API to generate AI responses
 * for flashcard generation.
 */
export class OpenRouterService {
  // Public fields as specified in the plan
  public readonly apiKey: string;
  public readonly baseURL: string;
  public readonly modelName: string;
  public modelParameters: ModelParameters;

  // Private fields
  private readonly _defaultSystemMessage = `You are an AI assistant specialized in creating educational flashcards. Your task is to analyze the provided text and create concise, effective flashcards that help users learn the key concepts.

Create flashcards following these rules:
1. Front side should be a clear, specific question
2. Back side should be a concise but comprehensive answer
3. Each flashcard should focus on one concept
4. Use clear, simple language
5. Avoid complex or compound questions

IMPORTANT: Your response must be a valid JSON object with a 'flashcards' array containing objects with 'front_content' and 'back_content' properties. Example:
{
  "flashcards": [
    {
      "front_content": "What is X?",
      "back_content": "X is Y"
    }
  ]
}`;

  private readonly _responseFormat: OpenRouterResponseFormat = {
    type: "json_schema",
    json_schema: {
      name: "flashcards-schema",
      schema: {
        type: "object",
        required: ["flashcards"],
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              required: ["front_content", "back_content"],
              properties: {
                front_content: { type: "string" },
                back_content: { type: "string" },
              },
            },
          },
        },
      },
    },
  };

  constructor(config?: Partial<OpenRouterConfig>) {
    // Initialize configuration variables with optional overrides
    this.apiKey = config?.apiKey || import.meta?.env?.OPENROUTER_API_KEY || OPENROUTER_API_KEY;
    this.baseURL = config?.baseURL ?? "https://openrouter.ai/api/v1";
    this.modelName = config?.modelName ?? "openai/gpt-4o-mini";
    // this.modelName = config?.modelName ?? 'deepseek/deepseek-v3-base:free';

    if (!this.apiKey) {
      throw new Error("OpenRouter API key is required");
    }

    if (!this.modelName) {
      throw new Error("OpenRouter model name is required");
    }

    if (!this.baseURL) {
      throw new Error("OpenRouter base URL is required");
    }

    // Set default model parameters
    this.modelParameters = {
      temperature: 0.7,
      max_tokens: 5000,
      top_p: 1,
      ...config?.defaultParameters,
    };
  }

  /**
   * Sends a chat completion request to generate a flashcard
   */
  public async sendChatCompletion(userMessage: string, context?: object): Promise<FlashcardResponse> {
    try {
      const payload = this._buildPayload(userMessage, context);

      logger.debug("Sending chat completion request", {
        context: "OpenRouterService",
        data: {
          model: this.modelName,
          messageLength: userMessage.length,
          hasContext: Boolean(context),
          payload,
        },
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://10x-flashcards.com",
          "X-Title": "10x Flashcards",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error("API request failed", {
          context: "OpenRouterService",
          data: {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          },
        });
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      logger.debug("Raw API response", {
        context: "OpenRouterService",
        data: JSON.stringify(data, null, 2),
      });

      const result = this._handleResponse(data);
      return result;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error(String(error)));
      throw new Error("Failed to generate flashcard");
    }
  }

  /**
   * Updates model parameters
   */
  public setModelParameters(parameters: Partial<ModelParameters>): void {
    this.modelParameters = {
      ...this.modelParameters,
      ...parameters,
    };
  }

  /**
   * Returns the current response format schema
   */
  public getResponseFormat(): typeof this._responseFormat {
    return { ...this._responseFormat };
  }

  /**
   * Builds the payload for the OpenRouter API request
   */
  private _buildPayload(userMessage: string, context?: object): OpenRouterPayload {
    // Enhance system message with context if provided
    let systemMessage = this._defaultSystemMessage;
    if (context) {
      systemMessage += `\nContext: ${JSON.stringify(context)}`;
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    logger.debug("Building API payload", {
      context: "OpenRouterService",
      data: {
        model: this.modelName,
        hasContext: Boolean(context),
        messageCount: messages.length,
      },
    });

    return {
      model: this.modelName,
      messages,
      response_format: this._responseFormat,
      ...this.modelParameters,
    };
  }

  /**
   * Handles and validates the API response
   */
  private _handleResponse(response: any): FlashcardResponse {
    try {
      // Validate response structure
      if (!response?.choices?.length) {
        throw new Error("Invalid response: missing choices array");
      }

      const choice = response.choices[0];
      logger.debug("Processing choice", {
        context: "OpenRouterService",
        data: { choice },
      });

      if (!choice?.message) {
        throw new Error("Invalid response: missing message");
      }

      const content = choice.message.content;
      if (!content || typeof content !== "string") {
        throw new Error(`Invalid response: invalid message content type: ${typeof content}`);
      }

      if (content.trim().length === 0) {
        throw new Error("Invalid response: empty message content");
      }

      let parsedContent: unknown;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        logger.error("Failed to parse response content", {
          context: "OpenRouterService",
          data: {
            content,
            error: e instanceof Error ? e.message : "Unknown error",
          },
        });
        throw new Error("Invalid response: content is not valid JSON");
      }

      // Type guard for FlashcardResponse
      if (!this._isFlashcardResponse(parsedContent)) {
        logger.error("Invalid response format", {
          context: "OpenRouterService",
          data: { parsedContent },
        });
        throw new Error("Invalid response: missing required fields or invalid types");
      }

      // Validate each flashcard's content
      for (const flashcard of parsedContent.flashcards) {
        if (!flashcard.front_content || !flashcard.back_content) {
          throw new Error("Invalid flashcard: missing content");
        }
        if (typeof flashcard.front_content !== "string" || typeof flashcard.back_content !== "string") {
          throw new Error("Invalid flashcard: content must be string");
        }
      }

      return parsedContent;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error("Response validation failed"));
      throw new Error("Invalid response format from API");
    }
  }

  /**
   * Type guard for FlashcardResponse
   */
  private _isFlashcardResponse(data: unknown): data is FlashcardResponse {
    if (!data || typeof data !== "object") return false;

    const candidate = data as Record<string, unknown>;
    if (!Array.isArray(candidate.flashcards)) return false;

    return candidate.flashcards.every(
      (flashcard) =>
        typeof flashcard === "object" &&
        flashcard !== null &&
        typeof (flashcard as FlashcardProposalDTO).front_content === "string" &&
        typeof (flashcard as FlashcardProposalDTO).back_content === "string"
    );
  }

  /**
   * Log errors safely without exposing sensitive data
   */
  private _logError(error: Error): void {
    // Remove sensitive data from error details
    const sanitizedError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    logger.error("OpenRouter API error", sanitizedError, {
      context: "OpenRouterService",
      data: {
        model: this.modelName,
        // Don't log the actual API key
        hasApiKey: Boolean(this.apiKey),
      },
    });
  }

  /**
   * Generates flashcards from the provided text
   */
  public async generateFlashcards(inputText: string, numberOfCards = 5): Promise<FlashcardProposal[]> {
    try {
      const userMessage = `Please create ${numberOfCards} flashcards from the following text:\n\n${inputText}`;

      logger.debug("Generating flashcards", {
        context: "OpenRouterService",
        data: {
          textLength: inputText.length,
          requestedCards: numberOfCards,
        },
      });

      const response = await this.sendChatCompletion(userMessage);

      if (!response.flashcards || !Array.isArray(response.flashcards)) {
        throw new Error("Invalid response format: missing flashcards array");
      }

      // Ensure we don't exceed the requested number of cards
      const flashcards = response.flashcards.slice(0, numberOfCards);

      logger.info("Successfully generated flashcards", {
        context: "OpenRouterService",
        data: {
          generatedCards: flashcards.length,
          requestedCards: numberOfCards,
        },
      });

      return flashcards;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error("Failed to generate flashcards"));
      throw new Error("Failed to generate flashcards");
    }
  }
}
