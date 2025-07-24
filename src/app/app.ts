import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs-backend-webgl';

interface KanyeQuote {
  quote: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);

  protected readonly title = signal('Toxicity Classifier');
  protected quote = signal<string | null>(null);
  protected isLoading = signal(false);
  protected isFetchingQuote = signal(false);
  protected isClassifying = signal(false);
  protected toxicityModel = signal<toxicity.ToxicityClassifier | null>(null);
  protected toxicityResult = signal<boolean | null>(null);
  protected userGuess = signal<boolean | null>(null);
  protected isResultRevealed = signal(false);
  protected modelThreshold = 0.9;

  ngOnInit() {
    void this.loadToxicityModel();
  }

  protected async loadToxicityModel(): Promise<void> {
    this.isLoading.set(true);
    try {
      const model = await toxicity.load(this.modelThreshold, []);
      this.toxicityModel.set(model);
    } catch (error) {
      console.error('Failed to load toxicity model:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  protected fetchQuote(): void {
    this.isFetchingQuote.set(true);
    this.quote.set(null);
    this.toxicityResult.set(null);
    this.userGuess.set(null);
    this.isResultRevealed.set(false);

    this.http.get<KanyeQuote>('https://api.kanye.rest/')
      .subscribe({
        next: (response) => {
          this.quote.set(response.quote);
          this.isFetchingQuote.set(false);
        },
        error: (error) => {
          console.error('Error fetching quote:', error);
          this.isFetchingQuote.set(false);
        }
      });
  }

  protected async classifyQuote(): Promise<void> {
    const currentQuote = this.quote();
    const model = this.toxicityModel();

    if (!currentQuote || !model) {
      return;
    }

    this.isClassifying.set(true);

    try {
      const predictions = await model.classify([currentQuote]);
      const toxicityPrediction = predictions.find(p => p.label === 'toxicity');
      console.log({ predictions });
      if (toxicityPrediction && toxicityPrediction.results.length > 0) {
        this.toxicityResult.set(toxicityPrediction.results[0].match);
      }
    } catch (error) {
      console.error('Error classifying quote:', error);
    } finally {
      this.isClassifying.set(false);
      this.revealResult();
    }
  }

  protected makeGuess(isToxic: boolean): void {
    this.userGuess.set(isToxic);
    void this.classifyQuote();
  }

  protected revealResult(): void {
    if (this.toxicityResult() === null && !this.isClassifying()) {
      void this.classifyQuote();
    }
    this.isResultRevealed.set(true);
  }

  protected resetQuote(): void {
    this.fetchQuote();
  }
}
