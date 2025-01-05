import { RecordViewModel } from '@/app/model/recordViewModel';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import fru_records from '@/assets/Dawntrail/FRU/fru_records.json';

@Component({
  selector: 'pip-cheatsheet-viewer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './cheatsheet.component.html',
  styleUrl: './cheatsheet.component.less',
})
export class CheatsheetComponent implements OnInit, OnDestroy {
  private _recordViewModel: RecordViewModel =
    this.createDefaultRecordViewModel();
  private _intervalId: any;
  private _startTime: number = 0;
  private _elapsedTime: number = 0; // in milliseconds
  private _minutes: number = 0;
  private _seconds: number = 0;
  private _milliseconds: number = 0;

  ngOnInit(): void {
    this._recordViewModel = fru_records[0] as RecordViewModel;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get recordViewModel(): RecordViewModel {
    return this._recordViewModel;
  }

  get timerString(): string {
    return `${this._minutes}:${this._seconds}.${this._milliseconds}`;
  }

  get isTimerStarted(): boolean {
    return this._intervalId != null;
  }

  private createDefaultRecordViewModel(): RecordViewModel {
    return {
      title: '',
      images: [],
      time: 0,
    };
  }

  private updateRecordViewModel(updateTime: number): void {
    this._recordViewModel = this.getThresholdRecordViewModel(updateTime);
  }

  private getThresholdRecordViewModel(threshold: number): RecordViewModel {
    return fru_records.reduce((max: RecordViewModel, obj: RecordViewModel) => {
      return obj.time <= threshold && obj.time >= max.time ? obj : max;
    }, this.createDefaultRecordViewModel());
  }

  public onImageClick(): void {
    this.isTimerStarted ? this.stopTimer() : this.startTimer();
  }

  public onReplayClick(): void {
    this.resetTimer();
    this.startTimer();
  }

  public onBackClick(): void {
    const recordViewModel = this.getThresholdRecordViewModel(this._elapsedTime);
    const recordViewModels = fru_records.sort((a, b) => a.time - b.time);
    this.startFrom(
      recordViewModels[
        Math.max(recordViewModels.indexOf(recordViewModel) - 1, 0)
      ]
    );
  }

  public onStartClick(): void {
    this.startTimer();
  }

  public onStopClick(): void {
    this.stopTimer();
  }

  public onNextClick(): void {
    const recordViewModel = this.getThresholdRecordViewModel(this._elapsedTime);
    const recordViewModels = fru_records.sort((a, b) => a.time - b.time);
    this.startFrom(
      recordViewModels[
        Math.min(
          recordViewModels.indexOf(recordViewModel) + 1,
          recordViewModels.length - 1
        )
      ]
    );
  }

  private startTimer(): void {
    this.stopTimer();
    this._startTime = Date.now() - this._elapsedTime;
    this._intervalId = setInterval((): void => {
      this._elapsedTime = Date.now() - this._startTime;
      this.updateTime();
      this.updateRecordViewModel(this._elapsedTime);
    }, 10);
  }

  private stopTimer(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private resetTimer(): void {
    this.stopTimer();
    this._elapsedTime = 0;
    this.updateTime();
    this.updateRecordViewModel(this._elapsedTime);
  }

  private startFrom(recordViewModel: RecordViewModel): void {
    this.stopTimer();
    this._elapsedTime = recordViewModel.time;
    this._startTime = Date.now() - this._elapsedTime;
    this._recordViewModel = recordViewModel;
    this.startTimer();
  }

  private updateTime(): void {
    this._minutes = Math.floor(this._elapsedTime / 60000);
    this._seconds = Math.floor((this._elapsedTime % 60000) / 1000);
    this._milliseconds = Math.floor((this._elapsedTime % 1000) / 10);
  }
}
