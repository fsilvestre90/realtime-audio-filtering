use wasm_bindgen::prelude::*;
use num_traits::cast::ToPrimitive;
use microfft::Complex32;

mod utils;

#[wasm_bindgen]
extern "C" {
  // Use `js_namespace` here to bind `console.log(..)` instead of just
  // `log(..)`
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);

}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}


#[wasm_bindgen]
pub struct MFCCProcessor {
  buffer_size: usize,
}

#[wasm_bindgen]
impl MFCCProcessor {
  pub fn new(buffer_size: usize) -> MFCCProcessor {
    utils::set_panic_hook();

    MFCCProcessor {
      buffer_size,
    }
  }

  pub fn calc_fft(&mut self, samples: &mut [f32]) -> Vec<Complex32> {
    if samples.len() < self.buffer_size {
      panic!("Insufficient samples passed to detect_pitch(). Expected an array containing {} elements but got {}", self.buffer_size, samples.len());
    }

    let spectrum = microfft::real::rfft_512(samples).to_owned();

    spectrum
  }
}
