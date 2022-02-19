import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {
  }
  transform(url?: string | null): unknown {
    return url ? this.domSanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }

}
