import { Input, Directive, ElementRef, OnInit, TemplateRef} from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
  @Input() value: any;
  @Input() HTMLValue: any;
  @Input() placement: any;
  @Input() customClass: any;
  @Input() maxWidth: any;
  @Input() fieldName: any;
  @Input() condition = true;
  @Input() reference: TemplateRef<any>;

  constructor(private el: ElementRef) {
    }

  ngOnInit() {
    if (this.value) {
      tippy(this.el.nativeElement, {
        placement: this.placement || 'top',
        content: this.value,
        theme: this.customClass || '',
        maxWidth: this.maxWidth || null,
        popperOptions: {
          // modifiers: {
          //   preventOverflow: {
          //     boundariesElement: 'window'
          //   }
          // }
        }
      });
    } else if (this.reference) {
      tippy(this.el.nativeElement, {
        // @ts-ignore
        content: this.reference
      });

    }
  }

}
